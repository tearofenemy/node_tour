const User = require('./../models/userModel');

exports.signup = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch(e) {
        res.status(400).json({
            status: 'failed',
            message: e.message
        });
    }
}