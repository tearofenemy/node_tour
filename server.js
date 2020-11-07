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

app.listen(port, () => {
    console.log(`App starting on localhost:${port}`);
});