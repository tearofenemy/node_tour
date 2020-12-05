const express = require('express');
const router = express.Router({mergeParams: true});

const {
    getReviews,
    createReview,
    deleteReview,
    getReview,
    updateReview,
    setTourUserIds
} = require('./../controllers/reviewController');

const {protect, restrictTo} = require('./../controllers/authController');


router.use(protect);
router
    .route('/')
    .get(getReviews)
    .post(protect, setTourUserIds, createReview);

router
    .route('/:id')
    .get(getReview)
    .patch(restrictTo('user', 'admin'), updateReview)
    .delete(deleteReview);

module.exports = router;
    