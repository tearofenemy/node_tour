const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');

const signToken = id => {
    return jwt.sign({id: id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup = async (req, res) => {
    try {
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
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
            return next();
        }
    
        const user = await User.findOne({email}).select('+password');
    
        if(!user || !(await user.correctPassword(password, user.password))) {
            return next();
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