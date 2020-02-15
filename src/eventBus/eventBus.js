const { EventEmitter } = require('events')
const eventEmitter = new EventEmitter()

// Set global deaultMaxListeners to 128
eventEmitter.defaultMaxListeners = 10
// to make eventemitter run asynchromously setImmediate() or process.nextTick().
exports.dispatch = async ( eventName, ...payload) => {
  process.nextTick(() => {
    eventEmitter.emit(eventName, payload )
  });
}

exports.subscribe = async (eventName, ...payload ) => {
  // By default, a maximum of 10 listeners can be registered for any single event
  // eventEmitter.setMaxListeners(10)
  setImmediate(() => {
    // this is all listers to run asynchronously
    eventEmitter.on( eventName, payload )
  })
}
exports.removeListener = async (eventName, ...payload) => {
  setImmediate(() => {
    eventEmitter.removeListener(eventName, payload )

  })
}

exports.removeAllListeners = () => {
  eventEmitter.removeAllListeners()
}

exports.getSubscribers = async ( eventName) => {
  eventEmitter.listeners( eventName )
}

exports.countAllListener = async (eventName) => {
  eventEmitter.listenerCount(eventName )
}

function addOnCloseEventHandlingToServer(server) {
  if (server) {
    server.on('close', function() {
      removeAllListeners()
    })
  }
}
