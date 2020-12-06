const express = require('express');
const {
    getUsers, 
    getUser, 
    createUser, 
    updateUser, 
    deleteUser,
    updateMe,
    deleteMe,
    getMe
} = require('../controllers/userController');

const {
    signup,
    login,
    forgotPassword,
    resetPassword,
    updatePassword,
    protect,
    restrictTo
} = require('../controllers/authController');

const router = express.Router();

router
    .route('/signup')
    .post(signup);

router
    .route('/login')
    .post(login);

router
    .route('/forgot-password')
    .post(forgotPassword);

router
    .route('/reset-password/:token')
    .patch(resetPassword);  


router.use(protect);

router
    .route('/updateMe')
    .patch(updateMe)    

router
    .route('/deleteMe')
    .delete(deleteMe) 

router
    .route('/me')
    .get(getMe, getUser)

router
    .route('/update-password')
    .patch(updatePassword); 

 
//router.use(restrictTo('admin'));      

router
    .route('/')
    .get(getUsers);

router
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);


module.exports = router;