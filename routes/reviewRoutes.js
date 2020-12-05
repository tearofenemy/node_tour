const express = require('express');
const route = express.Router();

const {
    getReviews,
    createReview,
    restrictTo
} = require('./../controllers/reviewController');

const {protect} = require('./../controllers/authController');


router
    .route('/')
    .get(getReviews)
    .post(protect, restrictTo('user'), createReview);

    