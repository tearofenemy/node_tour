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
    protect
} = require('../controllers/authController');

const router = express.Router();


router
    .route('/me')
    .get(protect, getMe, getUser)

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
    
router
    .route('/update-password')
    .patch(protect, updatePassword);    

router
    .route('/')
    .get(getUsers);

router
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

router
    .route('/updateMe')
    .patch(protect, updateMe)    

router
    .route('/deleteMe')
    .delete(protect, deleteMe) 

module.exports = router;