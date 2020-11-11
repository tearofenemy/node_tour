const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');

exports.signup = async (req, res) => {
    try {
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        });

        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });        

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