const User = require('./../models/userModel');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};

    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users
            }
        });
    } catch (e) {
        res.status(404).json({
            status: 'fail',
            message: e.message
        });
    }
};

exports.getUser = (req, res) => {
    const userID = req.params.id * 1;
    //const user = users.find(el => el.id === userID);

    // if(!user) {
    //     return res.status(404).json({
    //         status: 'failed',
    //         message: 'User not found'
    //     });
    // }

    res.status(200).json({
        status: 'success',
        // data: {
        //     user
        // }
    });
};

exports.updateMe = async (req, res, next) => {

    const filtererdObj = filterObj(req.body, 'name', 'email');

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filtererdObj, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
};

exports.deleteMe = async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {active: false});

    res.status(204).json({
        status: 'success',
        data: null
    });
};

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'failed',
        message: 'Invalid route'
    });
}

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'failed',
        message: 'Invalid route'
    });
}
exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'failed',
        message: 'Invalid route'
    });
}