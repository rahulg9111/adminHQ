const express = require('express');
const app = new express();

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 60 * 60 * 10,
    max: 100,
    message: "Too many request from this IP, please try again in an hour."
})
app.use('/api', limiter);

require('./startup/redirection')(app);

module.exports = app;