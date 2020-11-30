const crypto = require('crypto');
const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const sendEmail = require('./../utils/email');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    
    res.cookie('jwt', token, cookieOptions);

    user.password = undefined;
    
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

exports.signup = async (req, res) => {
    try {
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            role: req.body.role,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        });

        createSendToken(newUser, 201, res);
    } catch(e) {
        res.status(400).json({
            status: 'failed',
            message: e.message
        });
    }
}

exports.login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
    
        if(!email || !password) {
            return next(); //Provide data to login
        }
    
        const user = await User.findOne({email}).select('+password');
    
        if(!user || !(await user.correctPassword(password, user.password))) {
            return next(); //Incorrect password or email
        }
    
        const token = signToken(user._id);
    
        res.status(200).json({
            status: 'success',
            token
        });
    } catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message
        });
    }
}

exports.protect = async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
        return next(); // User are not logged in
    }

    //verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //check that if user still exists 
    const currentUser = await User.findById(decoded.id);
    if(!currentUser) {
        return next(); //the token belonging for this user does not longer exist
    }
    
    if(currentUser.changedPasswordAfter(decoded.iat)) {
        return next(); //User resently changed password. Please, log again
    }

    req.user = currentUser;
    next();
}

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(); //You are not have a permission
        }
    };

    next();
}

exports.forgotPassword = async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});

    if(!user) {
        return next(); //User with provided email not found. Try again
    }

    const resetToken = user.createPasswordResetToken();

    await user.save({validateBeforeSave: false});

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot password? Send request to reset your password via link: ${resetUrl}`;

    try {

        await sendEmail({
            email: user.email,
            subject: 'Your password reset token available 10 min',
            message
        });

        res.status(200).json({
            status: 'success',
            message: 'Token was sent to email'
        });
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave: false});

        return next(); //something went wrong
    }
}

exports.resetPassword = async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.body.token).digest('hex');

    const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()}});

    if(!user) {
        return next(); //Token invalid or was expired
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createSendToken(user, 200, res);
}


exports.updatePassword = async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    if(!(await user.comparePassword(req.body.currentPassword, user.password))) {
        return next(); //Passwords do not match
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    createSendToken(user, 200, res);
}