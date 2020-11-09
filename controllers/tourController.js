const Tour = require('./../models/tourModel');

exports.getTours = async (req, res) => {
    try {
        
        //FILTERING
        const queryObj = {...req.query};
        const excludedFields = ['limit', 'page', 'sort', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        //ADVANCED FILTERING
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        let query = Tour.find(JSON.parse(queryStr));
        
        //SORTING
        if(req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        const tours = await query;

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

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                tour: tour
            }
        })
    } catch(e) {
        res.status(404).json({
            status: 'failed',
            message: e.message
        });
    }
}

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }); 

        res.status(201).json({
            status: 'success',
            data: {
                tour: tour
            }
        })
    } catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message
        });
    }
    
    res.status(200).json({
        status: 'success',
        data: {
            tour: "<Updated tour/>"
        }
    });
};

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message
        });
    }
};