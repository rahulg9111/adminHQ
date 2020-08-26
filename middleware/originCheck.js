const debug = require("debug")("uaIP")

exports.uaLogWithIP = (req, res, next) => {
    let ua = req.headers['user-agent'];
    let ip = req.ip
    if (/firefox/i.test(ua))
        browser = 'firefox';
    else if (/chrome/i.test(ua))
        browser = 'chrome';
    else if (/safari/i.test(ua))
        browser = 'safari';
    else if (/msie/i.test(ua))
        browser = 'msie';
    else
        browser = 'unknown';

    debug(`Browser: ${browser}, IP: ${ip}`)
    next();
}

exports.allowedOrigin = (req, res, next) => {
    const allowedOrigins = require("config").get("origins")
    if(req.headers['user-agent'].includes("curl")) {
        res.status(403)
        res.send({
            error: "cURL Operation not allowed",
            message: "Forbidden",
            statusCode: 403
        })
        return;
    }
    if (true || allowedOrigins.indexOf(req.headers.origin) >= 0) {
        // res.header("Access-Control-Allow-Origin", req.headers.origin);
        res.header("Access-Control-Allow-Origin", "*");
    }
    else {
        res.status(403)
        res.send({
            error: "Operation not allowed",
            message: "Forbidden",
            statusCode: 403
        })
        return;
    }
    next()
}