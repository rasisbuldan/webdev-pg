// Sample mqtt publisher

var host_broker = 'localhost';
var port_broker = 1884;

var mqtt = require('mqtt');
var client = mqtt.connect(`mqtt://${host_broker}:${port_broker}`);

client.on('connect', function() {
  console.log(`Client at ${host_broker}:${port_broker} connected!`)
  
  // Send message every 1000ms
  setInterval(function() {
    console.log(`Sending message!`);
    
    // send random nubmer
    client.publish('rss75/sensor1', Math.random().toFixed(3).toString());
    client.publish('rss75/sensor2', Math.random().toFixed(3).toString());
  }, 1000);
})