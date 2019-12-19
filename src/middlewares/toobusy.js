const toobusy = require('toobusy-js');

// Middleware which blocks requests when the Node server is too busy
// now automatically retries the request at another instance of the server if it's too busy
module.exports = ( req, res, next ) => {
  // Don't send 503s in testing, that's dumb, just wait it out
  if (process.env.NODE_ENV !== 'testing' && !process.env.MONGO_URI_TESTS && toobusy()) {
    res.statusCode = 503;
    res.send(
      'It looks like Fleet api is very busy right now, please try again in a minute.'
    );
  } else {
    next();
  }
};
