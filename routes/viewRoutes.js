const express = require('express');
const {
    getOverview,
    getTour,
    getLogin
} = require('./../controllers/viewController');

const {protect} = require('./../controllers/authController');

const router = express.Router();

router
    .route('/')
    .get(getOverview);

router
    .route('/tour/:slug')
    .get(protect, getTour);    

router
    .route('/login')
    .get(getLogin)    

module.exports = router;