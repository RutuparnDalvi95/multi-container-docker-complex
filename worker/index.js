const keys = require('./keys')
const redis = require('redis')

// Client is not for messaging or broadcasting. It is their to deal with Redis server - CRUD
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
})

function fib(index) {
    if(index < 2) return 1
    return fib(index - 1)+ fib(index - 2)
}

// This is a redis Publisher - has different functionality that the Client
// It listens to events and broadcasts events
// Only publishers can establish communication - additional functionality that npm redis gives
// for users to establish communication out of the box
const sub = redisClient.duplicate()

// No idea why we call it 'message' , but this is the 'insert' event being received with
// appropriate value on the message ARG

// 'message' event is probably available out of the box with the PubSub system of redis client
sub.on('message',(channel,message)=>{
    redisClient.hset('values',message,fib(parseInt(message)))
})

// Event that publisher is listening to in the runtime environment
sub.subscribe('insert')
