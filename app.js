const express = require("express");
const carsRouter = require('./Routes/carsRoutes');
const authRouter = require('./Routes/authRouter');

let app = express();


app.use(express.json()); 

app.use('/api/v1/carrental', carsRouter);

app.use('/api/v1/users', authRouter);

module.exports = app;