const express = require('express');
const {
     getTours,
     getTour, 
     createTour, 
     updateTour, 
     deleteTour,
     aliasTours
} = require('../controllers/tourController');
const router = express.Router();

router
     .route('/top-5-cheap')
     .get(aliasTours, getTours);

router
     .route('/')
     .get(getTours)
     .post(createTour);

router
     .route('/:id')
     .get(getTour)
     .patch(updateTour)
     .delete(deleteTour);

module.exports = router;