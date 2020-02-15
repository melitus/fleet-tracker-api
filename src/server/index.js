const winston = require('winston')
const express = require('express')

const { appKey } = require('../config/credentials')
const { appInitLoader } = require('../loaders')
const app = express()

appInitLoader(app)
// listen to requests
app.listen(appKey.port, () =>
  winston.info(`server started on port ${appKey.port} (${appKey.env})`)
)

// Exports express

module.exports = app
