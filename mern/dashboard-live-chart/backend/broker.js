const aedes = require('aedes')();
const server = require('net').createServer(aedes.handle);
const brokerPort = 1884;

server.listen(brokerPort, () => {
  console.log(`[Aedes] Broker started and listening to port ${port}`);
});

aedes.on('client', (client) => {
  console.log(`[Aedes] Client connected with id ${client.id}`);
});

aedes.on('subscribe', (subscriptions, client) => {
  console.log(`[Aedes] Client with id ${client.id} subscribed with topic ${subscriptions[0].topic}`);
});