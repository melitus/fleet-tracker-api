const path = require('path');

// import .env variables
require('dotenv-safe').load({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example'),
  allowEmptyValues: true,

});

module.exports = {
  appKey: {
    name: process.env.APP_NAME,
    port: process.env.APP_PORT || 8000,
    host: process.env.HOST || 'localhost',
    env: process.env.NODE_ENV,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  },
  mongo: {
    uri: process.env.NODE_ENV === 'test'
      ? process.env.MONGO_URI_TESTS
      : process.env.MONGO_URI,
  },
  appLog: {
    logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  },
  
  JWT_SECRET: '224b9da9083e1a2080cf1bfd34a37c44',
};

