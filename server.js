const app = require('./app');
const dotenv = require('dotenv');

dotenv.config({path: './config.env'});

//console.log(process.env);

const port = process.env.port || 8000;
app.listen(port, () => {
    console.log(`App starting on localhost:${port}`);
});