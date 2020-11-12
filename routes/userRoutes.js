const express = require('express');
const {
    getUsers, 
    getUser, 
    createUser, 
    updateUser, 
    deleteUser
} = require('../controllers/userController');

const {
    signup,
    login
} = require('../controllers/authController');

const router = express.Router();

router
    .route('/signup')
    .post(signup);

router
    .route('/login')
    .post(login);

router
    .route('/')
    .get(getUsers);

router
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

module.exports = router;