const Review = require('./../models/reviewModel');


exports.getReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find();

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