const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = Model => async (req, res) => {
    try {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if(!doc) {
            throw new Error(`${Model} not found with passed id`);
        }

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

exports.updateOne = Model => async (req, res) => {
    try {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }); 

        if(!doc) throw new Error(`${Model} could not be found by passed id`);

        res.status(201).json({
            status: 'success',
            data: {
                data: doc
            }
        })
    } catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message
        });
    }
};

exports.createOne = Model => async (req, res) => {
    try {
        const newDoc = await Model.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                data: newDoc
            }
        });
    } catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message
        });
    }
}

exports.getOne = (Model, popOptions) => async (req, res) => {
    let query = Model.findById(req.params.id);
    if(popOptions) query = query.populate(popOptions);

    const doc = await query;

    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    });
}

exports.getAll = Model => async (req, res) => {
    try {
        
        //Allow to nester Route for Review Model
        let filter = {};
        if(req.params.tourId) filter = {tour: req.params.tourId};
        
        const features = new APIFeatures(Model.find(filter), req.query)
                            .filter()
                            .sort()
                            .limitFields()
                            .paginate();

        const doc = await features.query;

        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: {
                doc
            }
        });
    } catch(e) {
        res.status(404).json({
            status: 'failed',
            message: e.message
        });
    }
}