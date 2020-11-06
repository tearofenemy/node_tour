const express = require('express');
const fs = require('fs');

const users = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

const getUsers = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
};

const getUser = (req, res) => {
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
}

const router = express.Router();

router.route('/').get(getUsers);
router.route('/:id').get(getUser);

module.exports = router;