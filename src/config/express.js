const express = require('express');
const passport = require('passport');

const routes = require('../routes/index');
const middlewaresConfig = require('../middlewares/middlewaresConfig');
const strategies = require('./passport');
const error = require('../middlewares/error');


// Express instance/
const app = express();

// body-parser defaults to a body size limit of 100kb
app.use(express.json({ limit: '300kb' })); 

// Trust the now proxy
app.set('trust proxy', true);

// Middlewares
middlewaresConfig(app);

// enable authentication
app.use(passport.initialize());
passport.use('jwt', strategies.jwt);
passport.use('facebook', strategies.facebook);
passport.use('google', strategies.google);

// mount api routes
app.use('/', routes);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

module.exports = app;



