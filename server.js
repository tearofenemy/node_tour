const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({path: './config.env'});

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(conn => {
    console.log(conn.connections);
    console.log('DB successfully connected');
});

const port = process.env.port || 8000;
app.listen(port, () => {
    console.log(`App starting on localhost:${port}`);
});