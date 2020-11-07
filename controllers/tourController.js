const Tour = require('./../models/tourModel');

exports.getTours = async (req, res) => {
    try {
        const tours = await Tour.find();

        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        });
    } catch(e) {
        res.status(404).json({
            status: 'failed',
            message: e.message
        });
    }
};

exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message
        });
    }
}

exports.getTour = (req, res) => {
    // const id = req.params.id * 1;
    // const tour = tours.find(el => el.id === id);

    // res.status(200).json({
    //     status: 'success',
    //     data: {
    //         tour
    //     }
    // });    
}

exports.updateTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tour: "<Updated tour/>"
        }
    });
};

exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null
    }); 
};