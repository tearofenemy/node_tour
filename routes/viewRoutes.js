const express = require('express');
const {
    getOverview,
    getTour,
    getLogin,
    getAccount
} = require('./../controllers/viewController');

const {isLoggedIn, protect} = require('./../controllers/authController');

const router = express.Router();

//router.use(protect);

router
    .route('/me')
    .get(protect, getAccount);

//router.use(isLoggedIn);

router
    .route('/')
    .get(isLoggedIn, getOverview);

router
    .route('/tour/:slug')
    .get(isLoggedIn, getTour);    

router
    .route('/login')
    .get(isLoggedIn, getLogin)    

module.exports = router;