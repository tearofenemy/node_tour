const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser').json();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const limiter = rateLimit({
    max: 10,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests on this IP, please try again in a hour',
});

app.use(express.json());
app.use('/api', limiter);
//app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(cors());

//ROUTES

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
    throw new Error(`Could not find ${req.originalUrl} on this server`);
});

module.exports = app;