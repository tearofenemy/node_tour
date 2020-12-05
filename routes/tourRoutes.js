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
     .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

router
     .route('/') 
     .get(protect, getTours)
     .post(protect, restrictTo('admin', 'lead-guide'), createTour);

router
     .route('/:id')
     .get(getTour)
     .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
     .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);


module.exports = router;