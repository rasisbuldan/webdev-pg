/********** Initialization **********/
/* Express Initialization */
const express = require('express');
const app = express();
const port = 3001;

/* MQTT Initialization */
const mqttHost = 'localhost';
const mqttPort = 1884;
var subscribeTopic = ['topic/test1', 'topic/acceldata'];
const mqtt = require('mqtt');
const mqttClient = mqtt.connect(`mqtt://${mqttHost}:${mqttPort}`);

/* MongoDB Connector */
const dbHost = 'localhost';
const dbName = 'test-db';
const mongoose = require('mongoose');
mongoose.connect(`mongodb://${dbHost}/${dbName}`, {useNewUrlParser: true});
const db = mongoose.connection;

db.on('error', (err) => {
  console.log('Error: ', err.message);
});

db.once('open', () => {
  console.log(`Connection to DB on ${dbHost} successful!`);
});

/* Schema definition */
const accelDataSchema = new mongoose.Schema({
  timestampns: {type: Number},
  date: {type: String},
  xaccel: {type: Number},
  yaccel: {type: Number},
  zaccel: {type: Number}
});

const testMQTTSchema = new mongoose.Schema({
  timestamp: {type: String},
  topic: {type: String},
  message: {type: String}
},
{
  versionKey: false
});

const AccelData = mongoose.model('AccelData', accelDataSchema);
const TestMQTT = mongoose.model('TestMQTT', testMQTTSchema);

/* Global variable */
var dataBuffer = [];


/********** API **********/
app.listen(port, () => {
  console.log("Server up and running on port", port);
});

app.get('/testapi', (req, res, next) => {
  res.json('Hello from Test API!');
});

app.get('/flushdata', (req, res, next) => {
  res.json(dataBuffer);
  dataBuffer = [];
});


/********** MQTT **********/
mqttClient.on('connect', () => {
  console.log(`Connected to ${mqttHost}`);

  /* Batch subscribe */
  for (topic of subscribeTopic) {
    mqttClient.subscribe(topic, (err) => {
      if (!err) {
        console.log(`Subscribe to ${topic} successful!`);
      }
      else {
        console.log('Error occured: ', err);
      }
    });
  }
});

mqttClient.on('message', (topic, message) => {
  let d = new Date();
  let dateString = d.toLocaleString();
  
  if (topic == 'topic/test1') {
    let mqtt_data = new TestMQTT({
      timestamp: dateString,
      topic: topic,
      message: message.toString()
    });
  
    mqtt_data.save((err,result) => {
      if (err){
        console.log(err);
      }
      else {
        console.log(result);
      }
    });
  }

  /* dataBuffer.push({
    timestamp: dateString,
    topic: topic,
    message: message.toString()
  }); */
});