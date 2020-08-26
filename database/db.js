const mongoose = require('mongoose')
const host = require("config").get("DB_HOST")
const debug = require('debug')('db')

mongoose.connect(host,{ useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true })
.then(()=> debug('Connected to MongoDB'))
.catch((err)=> debug(err.name,err.message));