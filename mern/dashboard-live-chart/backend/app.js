/********** Initialization **********/
/* Express Initialization */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


/* Express add-on */
var whitelist = ['http://localhost:3000']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors());


/* MQTT Initialization */
const mqttHost = 'localhost';
const mqttPort = 1884;
var subscribeTopic = ['topic/test1', 'topic/acceltest1'];
const mqtt = require('mqtt');
const mqttClient = mqtt.connect(`mqtt://${mqttHost}:${mqttPort}`);


/* Socket.IO Initialization */
const socketPort = 3002;
const io = require('socket.io')();

io.on('connection', (client) => {
  console.log('[Socket] Socket client connected', client.id);
  client.on('motionData', (motion) => {
    console.log(`[Socket] Received motion data from client ${client.id}: ${motion}`);
  });

});
io.listen(socketPort);
console.log(`[Socket] Socket listening on ${socketPort}`);


/* MongoDB Connector */
const dbHost = 'localhost';
const dbName = 'test-db';
const mongoose = require('mongoose');

mongoose.connect(`mongodb://${dbHost}/${dbName}`, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.on('error', (err) => {
  console.log('Error: ', err.message);
});

db.once('open', () => {
  console.log(`[DB] Connection to ${dbHost} successful!`);
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

/* AR-Drone Connector */
var ardrone = require('ar-drone');
var client = ardrone.createClient();

const handleMotion = (action, speed) => {
  switch(action) {
    case 'takeoff':
      client.takeoff(speed);
      break;
    case 'forward':
      client.front(speed);
      break;
    case 'backward':
      client.back(speed);
      break;
    case 'right':
      client.right(speed);
      break;
    case 'left':
      client.left(speed);
      break;
    case 'up':
      client.up(speed);
      break;
    case 'down':
      client.down(speed);
      break;
  }
}


/********** Global Variable **********/
var dataBuffer = [];
var RMSBuffer = [];
var RMSData = [];
var nDataBuffer = 100;
var dataBufferAccel = {
  x: [],
  y: [],
  z: [],
}


/********** API **********/
app.listen(port, () => {
  console.log(`[Express] Server up and running on port ${port}`);
});

app.get('/testmsg', (req, res, next) => {
  res.json('Hello from Test API!');
});

app.get('/chartdata', (req, res, next) => {
  res.json(dataBuffer);
});

app.get('/chartdataaccel', (req, res, next) => {
  res.json(dataBufferAccel);
});

app.get('/chartdatarms', (req, res, next) => {
  res.json(RMSData.slice(-nDataBuffer));
})

app.post('/controlaction', (req, res, next) => {
  console.log(req.body);
})


/********** Socket API **********/




/********** MQTT **********/
mqttClient.on('connect', () => {
  console.log(`[MQTT] Connection to ${mqttHost} successful!`);
  /* Batch subscribe */
  for (topic of subscribeTopic) {
    mqttClient.subscribe(topic, (err) => {
      if (!err) {
        console.log(`[MQTT] Subscription to ${topic} successful!`);
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
    TestMQTT.create({
      timestamp: dateString,
      topic: topic,
      message: message.toString()
    });
    let num = Number(message.toString());
    dataBuffer.push(num);
    if (dataBuffer.length > nDataBuffer) {
      dataBuffer.shift();
    }
    RMSBuffer.push(num);
  }

  else if (topic == 'topic/acceltest1') {
    var msgData = JSON.parse(message.toString());
    dataBufferAccel.x.push(msgData.x);
    dataBufferAccel.y.push(msgData.y);
    dataBufferAccel.z.push(msgData.z);
    if (dataBufferAccel.x.length > nDataBuffer) {
      dataBufferAccel.x.shift();
      dataBufferAccel.y.shift();
      dataBufferAccel.z.shift();
    }
  }
});


/********** Calculation **********/
const CalculateRMS = (arr) => {
  Math.sqrt(arr.map( val => (val * val)).reduce((acum, val) => acum + val)/arr.length)
  let square = arr.map((val) => {
    return Math.pow(val,2);
  })
  let ssum = square.reduce((a, b) => a + b, 0);
  return Math.sqrt(ssum/arr.length);
};

setInterval(() => {
  var lenRMSBuf = RMSBuffer.length;
  //console.log(lenRMSBuf);
  if (lenRMSBuf > 0) {
    var rms = CalculateRMS(RMSBuffer);
    RMSBuffer = RMSBuffer.slice(lenRMSBuf);
    RMSData.push(rms);
  }
}, 2000);