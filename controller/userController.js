const fs = require('fs');

const users = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

exports.getUsers = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
};

exporst.getUser = (req, res) => {
    const userID = req.params.id * 1;
    const user = users.find(el => el.id === userID);

    if(!user) {
        return res.status(404).json({
            status: 'failed',
            message: 'User not found'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
};

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'failed',
        message: 'Invalid route'
    });
}

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'failed',
        message: 'Invalid route'
    });
}
exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'failed',
        message: 'Invalid route'
    });
}