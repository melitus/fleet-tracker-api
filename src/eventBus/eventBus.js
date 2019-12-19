import { EventEmitter } from 'events'
const eventEmitter = new EventEmitter()

// Set global deaultMaxListeners to 128
eventEmitter.defaultMaxListeners = 10
// to make eventemitter run asynchromously setImmediate() or process.nextTick().
export const dispatch = async ( eventName, ...payload) => {
  process.nextTick(() => {
    eventEmitter.emit(eventName, payload )
  });
}

export const subscribe = async (eventName, ...payload ) => {
  // By default, a maximum of 10 listeners can be registered for any single event
  // eventEmitter.setMaxListeners(10)
  setImmediate(() => {
    // this is all listers to run asynchronously
    eventEmitter.on( eventName, payload )
  })
}
export const removeListener = async (eventName, ...payload) => {
  setImmediate(() => {
    eventEmitter.removeListener(eventName, payload )

  })
}

export const removeAllListeners = () => {
  eventEmitter.removeAllListeners()
}

export const getSubscribers = async ( eventName) => {
  eventEmitter.listeners( eventName )
}

const countAllListener = async (eventName) => {
  eventEmitter.listenerCount(eventName )
}

export function addOnCloseEventHandlingToServer(server) {
  if (server) {
    server.on('close', function() {
      removeAllListeners()
    })
  }
}
