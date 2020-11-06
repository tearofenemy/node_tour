const app = require('./app');
const port = process.env.port || 8001;
app.listen(port, () => {
    console.log(`App starting on localhost:${port}`);
});