const express = require('express');
const {
    getOverview,
    getTour,
    getLogin,
    getAccount,
    updateUserData
} = require('./../controllers/viewController');

const {isLoggedIn, protect} = require('./../controllers/authController');

const router = express.Router();

router
    .route('/me')
    .get(protect, getAccount);

router
    .route('/')
    .get(isLoggedIn, getOverview);

router
    .route('/tour/:slug')
    .get(isLoggedIn, getTour);    

router
    .route('/login')
    .get(isLoggedIn, getLogin)    

router
    .route('/submit-user-data')
    .post(protect, updateUserData);    

module.exports = router;