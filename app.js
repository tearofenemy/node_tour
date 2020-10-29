import fs from 'fs';
import express from 'express';

const {log} = console;
const port = process.env.port || 8000;
const app = express();


const tours = JSON.parse(
    fs.readFileSync('./dev-data/data/tours-simple.json')
);

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json(
        {
            status: 'success', 
            results: tours.length,
            data: {
                tours: tours
            }
        })
});



app.listen(port, () => {
    log(`App starting on localhost:${port}`);
})