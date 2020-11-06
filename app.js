const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser').json();
const morgan = require('morgan');
const port = process.env.port || 8001;
const app = express();
const {log} = console;

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

app.use(express.json());
app.use(morgan('dev'));


app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);


app.listen(port, () => {
    log(`App starting on localhost:${port}`);
});