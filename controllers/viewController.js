const Tour = require('./../models/tourModel');

exports.getOverview = async (req, res) => {
    const tours = await Tour.find();

    res.status(200).render('overview', {
        title: 'Overview Page',
        tours
    });
}

exports.getTour = async (req, res) => {

    const tour = await Tour.findOne({slug: req.params.slug}).populate({
        path: 'reviews',
        fields: 'review rating user'
    });

    res.status(200).render('tour', {
        tour
    });   
}