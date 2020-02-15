const { expressLoader } = require('./expressLoader')
const { connectMongoWithRetry } = require('./mongooseLoader')

exports.appInitLoader = async app => {
  await connectMongoWithRetry()
  console.log('MongoDB Intialized')
  expressLoader(app)
  console.log('Express Intialized')
}
