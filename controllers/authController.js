const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup = async (req, res) => {
    try {
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            role: req.body.role,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        });

        const token = signToken(newUser._id);    

        res.status(201).json({
            status: 'success',
            token,
            data: {
                newUser
            }
        });
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
    const user = User.findOne({email: req.body.email});

    if(!user) {
        return next(); //User with provided email not found. Try again
    }

    const resetToken = user.createPasswordResetToken();

    await user.save({validateBeforeSave: false});
}

exports.resetPassword = (req, res, next) => {

}