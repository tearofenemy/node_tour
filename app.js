const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser').json();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
//const hpp = require('hpp');
const app = express();

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const limiter = rateLimit({
    max: 10,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests on this IP, please try again in a hour',
});

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use('/api', limiter);
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
// app.use(hpp({
//     whitelist: [
//         'duration',
//         'ratingsQuantity',
//         'ratingsAverage',
//         'maxGroupSize',
//         'difficulty',
//         'price'
//     ]
// }));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;