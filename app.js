const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser').json();
const morgan = require('morgan');
const port = process.env.port || 8001;
const app = express();
const {log} = console;

app.use(express.json());
app.use(morgan('dev'));

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const users = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/users.json`)
);

const getTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    })
};

const createPost = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = {id: newId, ...req.body};

    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        if(err) throw err;
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    });
}

const getTour = (req, res) => {
    const id = req.params.id * 10;
    const tour = tours.find(el => el.id === id);

    if(!tour) {
        return res.status(404).json(
            {
                status: 'failed',
                message: 'Invalid ID'   
            }
        );
    }

    res.status(200).json(
        {
            status: 'success',
            data: {
                tour
            }
        });    
}


const updateTour = (req, res) => {
    if(req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'failed',
            message: 'Invalid ID'
        });

    }  
   
    res.status(200).json({
        status: 'success',
        data: {
            tour: "<Updated tour/>"
        }
    });
};

const deleteTour = (req, res) => {
    if(req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'failed',
            message: 'Invalid ID'
        });

    }

    res.status(204).json({
        status: 'success',
        data: null
    }); 
};

const getUsers = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
};


/**
 * 
 * TOURS ROUTE
 * 
 */
app.route('/api/v1/tours/').get(getTours).post(createPost);
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);


/**
 * 
 * USERS ROUTE
 * 
 */
app.route('/api/v1/users').get(getUsers);
//app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser);

app.listen(port, () => {
    log(`App starting on localhost:${port}`);
});