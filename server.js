const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const port = process.env.port || 8000;

dotenv.config({path: './config.env'});

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('DB successfully connected'));

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name"],
        unique: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, "A tour must have a price"]
    }
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
    name: 'Some Name',
    rating: 4.8,
    price: 581
});

testTour
        .save()
        .then(tr => console.log(tr))
        .catch(e => console.log(e));

app.listen(port, () => {
    console.log(`App starting on localhost:${port}`);
});