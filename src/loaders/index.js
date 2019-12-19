const expressLoader = require('./expressLoader');
const {connectMongoWithRetry} = require('./mongooseLoader')
const loadEnv = require('./loadenv')

exports.appInitLoader = async (app) => {
  await loadEnv()
   await connectMongoWithRetry();
  console.log('MongoDB Intialized');
  await expressLoader( app );
  console.log('Express Intialized');
}