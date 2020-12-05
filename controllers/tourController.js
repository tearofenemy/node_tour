const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const factory = require('./handlerFactory');

//miidleware for top 5 cheap tours
exports.aliasTours = (req, res, next) => {
    req.query.limit = "5";
    req.query.sort = "-ratingsAverage,price";
    req.query.fields = "name,difficulty,price,ratingsAverage,summary";
    next();
};

exports.getTours = async (req, res) => {
    try {
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const tours = await features.query;

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
        const tour = await Tour.findById(req.params.id).populate('reviews');

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


exports.deleteTour = factory.deleteOne(Tour);


exports.getToursStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
          {
            $match: {ratingsAverage: {$gte: 4.5}}
          },
          {
            $group: {
                _id: '$difficulty',
                numTours: {$sum: 1},
                numRatings: {$sum: '$ratingsQuantity'},
                avgPatings: {$avg: '$ratingsAverage'},
                avgPrice: {$avg: '$price'},
                minPrice: {$min: '$price'},
                maxPrice: {$max: '$price'},
            }
          },
          {
            $sort: {avgPrice: 1}
          }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        });
    } catch (e) {
        res.status(404).json({
            status: 'failed',
            message: e.message
        });
    }
}

exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1;

        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: {$month: '$startDates'},
                    numToursStats: {$sum: 1},
                    tours: {$push: '$name'}
                }
            },
            {
                $addFields: {month: '$_id'}
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: {numToursStarts: -1}
            },
            {
                $limit: 6
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        });
    } catch (e) {
        res.status(404).json({
            status: 'fail',
            message: e.message
        })
    }
}