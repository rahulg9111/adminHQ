const morgan = require('morgan');
const cors = require('cors');
const express = require('express');
const hpp = require('hpp');
const globalErrorHandler = require('../controller/ErrorController');
const AppError = require("./../utils/appError");
const { uaLogWithIP, allowedOrigin } = require('../middleware/originCheck');

module.exports = function (app) {

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(cors());
	app.use(uaLogWithIP, allowedOrigin, function (req, res, next) {
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
		next();
	});

	if(process.env.NODE_ENV === "development") {
		app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
	}

	app.use(express.static('public'));
	app.use(hpp());

	require('../database/db');
	require('../routes').setRoutes(app)
	app.use('/', function endpointNotFoundHandler(req, res, next) {
		next(new AppError('Endpoint Not Found', 404));
	});
	app.use(globalErrorHandler);
}