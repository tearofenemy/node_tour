const express = require('express');
const {getTours, getTour, createTour, updateTour, deleteTour, checkID, checkBody} = require('../controllers/tourController');
const router = express.Router();

//router.param('id');

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