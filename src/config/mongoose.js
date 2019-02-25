const mongoose = require('mongoose');
const winston = require('winston');

const { mongo } = require('./credentials');

// make bluebird default Promise
mongoose.Promise = require('bluebird'); 

let gracefulShutdown;

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
  };
// Connecting to Database
 mongoose.connect( mongo.uri, options );

// Checking if connection to db was successful
mongoose.connection.on('connected', () => {
    winston.info('Mongoose successfully connected to database URL: '+ mongo.uri);
});

mongoose.connection.on('error', (err) => {
    winston.error("Mongoose connection error occurred. Error: " + err);
});

mongoose.connection.on('disconnected', () => {
    winston.info("Mongoose connection lost...");
});

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
gracefulShutdown = function (msg, callback) {
    mongoose.connection.close(function () {
        winston.info('Mongoose disconnected through ' + msg);
        callback();
    });
};
// For nodemon restarts
process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart', function () {
        process.kill(process.pid, 'SIGUSR2');
    });
});
// For app termination
process.on('SIGINT', function () {
    gracefulShutdown('app termination', function () {
        process.exit(0);
    });
});

 module.exports = mongoose;




