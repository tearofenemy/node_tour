const User = require('./../models/userModel');
const multer = require('multer');
const sharp = require('sharp');
const {deleteOne, updateOne, getOne, getAll} = require('./handlerFactory');

/*const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/users');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null,`user-${req.user.id}-${Date.now()}.${ext}`);
    }
}); */


const multerStorage = multer.memoryStorage();


const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb('No an img. Upload only images.', false);
    }
}


const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});


const filterObj = (obj, ...allowedFields) => {
    const newObj = {};

    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.uploadUserAvatar = upload.single('avatar');

exports.resizeUserAvatar = (req, res, next) => {
    if(!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(`public/img/users/${req.file.filename}`);

    next();    
}


exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}

exports.getUsers = getAll(User);
exports.getUser = getOne(User);

exports.updateMe = async (req, res, next) => {

    if(req.body.password || req.body.confirmPassword) {
        next(); //this route is not for update pass.
    }

    const filteredBody = filterObj(req.body, 'name', 'email');

    if(req.file) filteredBody.avatar = req.file.filename;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
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