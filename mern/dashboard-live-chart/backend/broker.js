const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)
const port = 1884

server.listen(port, () => {
  console.log(`Broker started and listening to port ${port}`)
})

server.on('connection', () => {
  console.log('Connection!')
})

aedes.on('client', (client) => {
  console.log(`Client connected with id ${client.id}`);
});

aedes.on('subscribe', (subscriptions, client) => {
  console.log(`Client with id ${client.id} subscribed with topic ${subscriptions[0].topic}`)
})