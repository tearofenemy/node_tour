const express = require('express');
const {
    getOverview,
    getTour,
    getLogin
} = require('./../controllers/viewController');

const {isLoggedIn} = require('./../controllers/authController');

const router = express.Router();

router.use(isLoggedIn);

router
    .route('/')
    .get(getOverview);

router
    .route('/tour/:slug')
    .get(getTour);    

router
    .route('/login')
    .get(getLogin)    

module.exports = router;