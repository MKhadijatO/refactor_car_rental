const express = require("express");
const carsRouter = require('./components/car/carsRoutes');
const authRouter = require('./components/user/authRouter');

let app = express();


app.use(express.json()); 

app.use('/api/v1/carrental', carsRouter);

app.use('/api/v1/users', authRouter);

module.exports = app;