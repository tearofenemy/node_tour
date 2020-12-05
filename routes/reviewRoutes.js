const express = require('express');
const router = express.Router({mergeParams: true});

const {
    getReviews,
    createReview,
    deleteReview
} = require('./../controllers/reviewController');

const {protect, restrictTo} = require('./../controllers/authController');

router
    .route('/')
    .get(getReviews)
    .post(protect, restrictTo('user'), createReview);

router
    .route('/:id')
    .delete(deleteReview);

module.exports = router;
    