exports.deleteOne = Model => async (req, res) => {
    try {
        await Model.findByIdAndDelete(req.params.id);

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
