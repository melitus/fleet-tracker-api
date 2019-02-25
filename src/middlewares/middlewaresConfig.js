const bodyParser = require('body-parser');
const morgan = require('morgan');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const rateLimit = require("express-rate-limit");

const { appLog } = require('../config/credentials');

// this help to limit concurrent requests to prevent brute-force attacks 
// if not set,it could result to denial of service or service un available
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
 
module.exports = app => {
  app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  app.use(bodyParser.json()); // parse body params and attach them to req.body
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(morgan(appLog.logs));  // request logging. dev: console | production: file
  app.use(compress());  // Send all responses as gzip
  app.use(methodOverride()); // lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it
  app.use(cors());   // enable CORS - Cross Origin Resource Sharing
  app.use(limiter);  //  apply to all requests
};

 

