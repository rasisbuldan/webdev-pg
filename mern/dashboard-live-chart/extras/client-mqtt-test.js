/* Connection details */
var host = 'localhost';
var port = 1884;

/* MQTT Initialization */
const mqtt = require('mqtt');
console.log(`Connecting to ${host}:${port}`);
const client = mqtt.connect(`mqtt://${host}:${port}`);

/* Global Variable */
var dataCount = 0;
const nData = 100000;

client.on('connect', () => {
  console.log('Connected!')
  client.subscribe('topic/test1', (err) => {
    if (!err) {
      
      /* Continuously send message with timestamp*/
      /* setInterval(() => {
        let d = new Date();
        let dateString = d.toLocaleString()
        client.publish('topic/test1', `Hello world!`);
        dataCount++;
        console.log(dataCount);
      }, 1); */
      
    }
  });
});


/* client.on('message', (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message}`);
}); */

function sendRandomData(nData) {
  const startTime = new Date().getTime();
  for (let i = 0; i < nData; i++) {
    client.publish('topic/test1', (Math.random()*10).toString(), { qos:1 });
    dataCount++;
  }
  const endTime = new Date().getTime();
  console.log(`Sent ${nData} data points in ${endTime-startTime}ms`);
}