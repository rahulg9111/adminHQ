const handleError = e => {
    return "Duplicate error"
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

const sendErrorProd = (err, res) => {
    res.status(err.statusCode).json({
        statusCode: err.statusCode,
        status: err.status,
        message: err.message,
        error: true
    })
}

module.exports = function (err, req, res, next) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status ? err.status : `${err.statusCode}`.startsWith('4') ? 'fail' : 'error';

    if (process.env.NODE_ENV == 'development') {
        sendErrorDev(err, res);
    }
    else if (process.env.NODE_ENV == 'production') {
        if (err.name == 'MongoError') err.message = handleError(err)
        err.message = err.message ? err.message : 'Something went wrong, please try again later.';
        sendErrorProd(err, res);
    }
}