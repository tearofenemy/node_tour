const express = require('express');

const {
     getTours,
     getTour, 
     createTour, 
     updateTour, 
     deleteTour,
     aliasTours,
     getToursStats,
     getMonthlyPlan,
     getToursWithin,
     getDistances,
     uploadTourImages
} = require('../controllers/tourController');

const {createReview} = require('../controllers/reviewController');
const reviewRouter = require('../routes/reviewRoutes');

const {protect, restrictTo} = require('../controllers/authController');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router
     .route('/tour-within/:distance/center/:latlng/unit/:unit')
     .get(getToursWithin);

router
     .route('/distances/:latlng/unit/:unit')
     .get(getDistances)     

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
     .patch(protect, uploadTourImages, restrictTo('admin', 'lead-guide'), updateTour)
     .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;