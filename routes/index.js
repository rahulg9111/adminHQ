const authRoute = require("./auth")

function setRoutes(app) {
    const API_VERSION = 'v1'
    const API_ROUTE = `/api/${API_VERSION}/`
    app.use(`${API_ROUTE}auth`, authRoute)
}

module.exports = {
    setRoutes
}