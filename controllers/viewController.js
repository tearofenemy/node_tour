const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');

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

exports.getLogin = (req, res) => {
    res.status(200).render('login', {
        title: 'LOG INTO YOUR ACCOUNT'
    });
}

exports.getSignUp = (req, res) => {
    res.status(200).render('signup');
}

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'Your Account'
    });
}

exports.updateUserData = async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
    }, {
        new: true,
        runValidators: true
    });

    res.status(200).render('account', {
        title: 'Your Account',
        user: updatedUser 
    });
}