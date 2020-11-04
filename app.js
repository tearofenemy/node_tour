const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser').json();
const {log} = console;
const port = process.env.port || 8000;
const app = express();

app.use(express.json());


const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);


app.get('/api/v1/tours', (req, res) => {
    res.status(200).json(
        {
            status: 'success', 
            results: tours.length,
            data: {
                tours
            }
        });
});

app.post('/api/v1/tours', bodyParser, (req, res) => {
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
});


app.listen(port, () => {
    log(`App starting on localhost:${port}`);
})