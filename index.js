var fileExt = 'development' 
fileExt = 'production'
require('dotenv').config({path: __dirname + `/.env.${fileExt}`});
const app = require('./server.js')
const debug = require('debug')('startup');
process.on('uncaughtException',err=>{
    debug('Uncaught Exception: ',err.name,':',err.message);
    process.exit(1);
})

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT,(err)=>{
    debug(`Listening to PORT ${PORT}`)
})

process.on('unhandledRejection',err=>{
    debug('Unhandled Rejection: ',err.name,':',err.message)
    server.close(()=>{
        process.exit(1);
    })
})