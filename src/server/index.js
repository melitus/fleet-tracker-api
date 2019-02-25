const winston = require('winston');

const { appKey } = require('../config/credentials');
const app = require('../config/express');

// open mongoose connection
require('../config/mongoose');

// listen to requests
app.listen(appKey.port, () => winston.info(`server started on port ${appKey.port} (${appKey.env})`));

// Exports express

module.exports = app;
