const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');

exports.getReviews = async (req, res, next) => {
    try {

        let filter = {};

        if(req.params.tourId) filter = {tour: req.params.tourId};
        const reviews = await Review.find(filter);

        res.status(200).json({
            status: 'success',
            results: reviews.length,
            data: {
                reviews
            }
        });
    } catch (e) {
        res.status(404).json({
            status: 'failed',
            message: 'Review not found'
        });
    }
}

exports.createReview = async (req, res, next) => {
    try {

        if(!req.body.tour) req.body.tour = req.params.tourId;
        if(!req.body.user) req.body.user = req.user.id;
        const newReview = await Review.create(req.body.review);

        res.status(201).json({
            status: 'success',
            message: 'Review saved',
            data: {
                review: newReview
            }
        });
    } catch (e) {

    }
}

exports.deleteReview = factory.deleteOne(Review);