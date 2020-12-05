const express = require('express');

const {
     getTours,
     getTour, 
     createTour, 
     updateTour, 
     deleteTour,
     aliasTours,
     getToursStats,
     getMonthlyPlan
} = require('../controllers/tourController');

const {createReview} = require('../controllers/reviewController');
const reviewRouter = require('../routes/reviewRoutes');

const {protect, restrictTo} = require('../controllers/authController');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router
     .route('/top-5-cheap')
     .get(aliasTours, getTours);

router
     .route('/tour-stats')
     .get(getToursStats);

router
     .route('/monthly-plan/:year')
     .get(getMonthlyPlan);

router
     .route('/')
     .get(protect, getTours)
     .post(createTour);

router
     .route('/:id')
     .get(getTour)
     .patch(updateTour)
     .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

// router
//      .route('/:tourId/reviews')
//      .post(protect, restrictTo('user'), createReview);     

module.exports = router;