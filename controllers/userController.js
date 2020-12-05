const User = require('./../models/userModel');
const {deleteOne, updateOne, getOne, getAll} = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};

    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}

exports.getUsers = getAll(User);

exports.getUser = getOne(User);

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

exports.updateUser = updateOne(User);
exports.deleteUser = deleteOne(User);