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
      setInterval(() => {
        client.publish('topic/test2', (20 + Math.random()*60 - Math.random()*20).toString(), { qos:1 });
      }, 100);

      /* setInterval(() => {
        var payload = {
          x: (20 + Math.random()*60).toString(),
          y: (20 + Math.random()*60).toString(),
          z: (20 + Math.random()*60).toString()
        }
        client.publish('topic/acceltest1', JSON.stringify(payload), {qos: 1});
      }, 500); */
    }
  });
});


/* client.on('message', (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message}`);
}); */

function sendRandomData(nData) {
  const startTime = new Date().getTime();
  for (let i = 0; i < nData; i++) {
    client.publish('topic/test2', (Math.random()*10).toString(), { qos:1 });
    dataCount++;
  }
  const endTime = new Date().getTime();
  console.log(`Sent ${nData} data points in ${endTime-startTime}ms`);
}