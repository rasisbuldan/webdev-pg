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
app.use(cors(corsOptions));


/* Aedes broker */
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

aedes.on('clientDisconnect', (client) => {
  console.log(`[Aedes] Client disconnected with id ${client.id}`);
});


/* MQTT Initialization */
var subscribeTopic = ['topic/test1', 'topic/acceltest1', 'topic/mpu6050', 'topic/pi/mpu6050', 'topic/navdataraw'];
const mqttHost = 'localhost';
const mqttPort = 1884;
const mqtt = require('mqtt');
const mqttClient = mqtt.connect(`mqtt://${mqttHost}:${mqttPort}`);


/* Socket.IO Initialization */
const socketPort = 3002;
const io = require('socket.io')();
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
  timestamp: {type: Number},
  mpu1: {
    x: {type: Number},
    y: {type: Number},
    z: {type: Number}
  },
  mpu2: {
    x: {type: Number},
    y: {type: Number},
    z: {type: Number}
  }
},
{
  versionKey: false
});

const testMQTTSchema = new mongoose.Schema({
  timestamp: {type: String},
  topic: {type: String},
  message: {type: String}
},
{
  versionKey: false
});

const navdataDroneSchema = new mongoose.Schema({
  timestamp: {type: String},
  navdata: {
    batteryPercentage: {type: Number},
    altitude: {type: Number},
    orientation: {
      roll: {type: Number},
      pitch: {type: Number},
      yaw: {type: Number},
    },
    pwm: {
      mot1: {type: Number},
      mot2: {type: Number},
      mot3: {type: Number},
      mot4: {type: Number},
    },
  },
},
{
  versionKey: false
});

const AccelData = mongoose.model('AccelData', accelDataSchema);
const TestMQTT = mongoose.model('TestMQTT', testMQTTSchema);
const NavdataDrone = mongoose.model('NavdataDrone', navdataDroneSchema);

/* AR-Drone Connector */
var ardrone = require('ar-drone');
var ardroneClient = ardrone.createClient({
  ip: '192.168.0.200'
});
ardroneClient.config('general:navdata_demo', 'FALSE');  // Send all navigation data

const handleMotion = (action, speed) => {
  switch(action) {
    case 'takeoff':
      ardroneClient.takeoff(speed);
      break;
    case 'land':
      ardroneClient.stop();
      ardroneClient.land();
      break;
    case 'forward':
      ardroneClient.front(speed);
      break;
    case 'backward':
      ardroneClient.back(speed);
      break;
    case 'right':
      ardroneClient.right(speed);
      break;
    case 'left':
      ardroneClient.left(speed);
      break;
    case 'up':
      ardroneClient.up(speed);
      break;
    case 'down':
      ardroneClient.down(speed);
      break;
  }
}


/********** Global Variable **********/
var dataBuffer = [];
var RMSBuffer = [];
var RMSData = [];
var nDataBuffer = 100;
var accelBuffer = [];
var nDataBufferAccel = 100;
var dataBufferAccel = {
  mpu1: {
    x: [],
    y: [],
    z: [],
  },
  mpu2: {
    x: [],
    y: [],
    z: [],
  },
}

var nAccel = 0;


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
  RMSData = RMSData.slice(-nDataBuffer);
  res.json(RMSData);
});

app.post('/controlaction', (req, res, next) => {
  console.log(req.body);
});


/********** Socket **********/
io.sockets.on('connection', (socket) => {
  console.log(`[Socket] connection from ${socket.id}`);

  /* Motion data */
  socket.on('motionData', (motion) => {
    console.log(`[Socket] Received motion data from client ${socket.id}: ${motion}`);
    
    /* Insert handleMotion */
    //handleMotion(motion, 0.1);
  });
});

/* Live Raw Chart */
setInterval(() => {
  io.sockets.emit('chartdata', dataBuffer);
}, 10);

/* Live Accel1 Chart */
setInterval(() => {
  io.sockets.emit('acceldata1', dataBufferAccel.mpu1);
}, 10);

/* Live Accel1 Chart */
setInterval(() => {
  io.sockets.emit('acceldata2', dataBufferAccel.mpu2);
}, 10);

/* Live RMS Chart */
setInterval(() => {
  RMSData = RMSData.slice(-nDataBuffer);
  io.sockets.emit('chartdatarms', RMSData);
}, 10);

/* setInterval(() => {
  console.log(`${dataBufferAccel.mpu1.x.length}, ${dataBufferAccel.mpu1.y.length}, ${dataBufferAccel.mpu1.z.length}`)
},1000); */


/********** MQTT **********/
/* Connect to broker and subscribe */
mqttClient.on('connect', () => {
  console.log(`[MQTT] Connection to ${mqttHost} successful!`);
  /* Batch subscribe */
  for (topic of subscribeTopic) {
    mqttClient.subscribe(topic, (err, granted) => {
      if (!err) {
        console.log(`[MQTT] Subscription to ${granted[0].topic} at qos ${granted[0].qos} successful!`);
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

  /* Acceleration data demo */
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

  /* MPU6050 raw vibration (2 mpu) - Raspi ZeroW */
  else if (topic == 'topic/pi/mpu6050') {
    var msgData = JSON.parse(message.toString());
    
    /* Insest to dataBuffer */
    dataBufferAccel.mpu1.x.push(msgData.mpu1.x);
    dataBufferAccel.mpu1.y.push(msgData.mpu1.y);
    dataBufferAccel.mpu1.z.push(msgData.mpu1.z);
    dataBufferAccel.mpu2.x.push(msgData.mpu2.x);
    dataBufferAccel.mpu2.y.push(msgData.mpu2.y);
    dataBufferAccel.mpu2.z.push(msgData.mpu2.z);

    if (dataBufferAccel.mpu1.x.length > nDataBufferAccel) {
      dataBufferAccel.mpu1.x.shift();
      dataBufferAccel.mpu1.y.shift();
      dataBufferAccel.mpu1.z.shift();
      dataBufferAccel.mpu2.x.shift();
      dataBufferAccel.mpu2.y.shift();
      dataBufferAccel.mpu2.z.shift();
    }

    /* Insert to DB */
    AccelData.create({
      timestamp: Math.floor(Number(msgData.timestamp)/1000000),
      mpu1: {
        x: Number(msgData.mpu1.x),
        y: Number(msgData.mpu1.y),
        z: Number(msgData.mpu1.z)
      },
      mpu2: {
        x: Number(msgData.mpu2.x),
        y: Number(msgData.mpu2.y),
        z: Number(msgData.mpu2.z)
      }
    });
  }

  /* MPU6050 raw vibration data (sample) */
  else if (topic == 'topic/mpu6050') {
    var msgData = JSON.parse(message.toString());
    nAccel++;
    console.log(nAccel);
    let num = Number(msgData.mpu1.x);
    accelBuffer.push(num);
    if (accelBuffer.length > nDataBuffer) {
      accelBuffer.shift();
    }
  }

  /* Navigation data (ARDrone) */
  else if (topic == 'topic/navdataraw') {
    let navdata = JSON.parse(message.toString());
    let payload = {
      navdata: {
        batteryPercentage: 0,
        altitude: 0,
        orientation: {
          roll: 0,
          pitch: 0,
          yaw: 0,
        },
        pwm: {
          mot1: 0,
          mot2: 0,
          mot3: 0,
          mot4: 0,
        },
      }
    }
  
    if (navdata.demo) {
      payload.navdata.batteryPercentage = navdata.demo.batteryPercentage
      payload.navdata.orientation.roll = navdata.demo.leftRightDegrees
      payload.navdata.orientation.pitch = navdata.demo.frontBackDegrees
      payload.navdata.orientation.yaw = navdata.demo.clockwiseDegrees
      payload.navdata.altitude = navdata.demo.altitude
    }
  
    if (navdata.pwm) {
      payload.navdata.pwm.mot1 = navdata.pwm.motors[0]
      payload.navdata.pwm.mot2 = navdata.pwm.motors[1]
      payload.navdata.pwm.mot3 = navdata.pwm.motors[2]
      payload.navdata.pwm.mot4 = navdata.pwm.motors[3]
    }
    
    var navdataTimeMs = d.getTime();
    NavdataDrone.create({
      timestamp: navdataTimeMs.toString(),
      navdata: payload.navdata
    });
  }
});


/********** Calculation **********/
/* Calculate Root Mean Square (RMS) from array*/
const CalculateRMS = (arr) => {
  Math.sqrt(arr.map( val => (val * val)).reduce((acum, val) => acum + val)/arr.length)
  let square = arr.map((val) => {
    return Math.pow(val,2);
  })
  let ssum = square.reduce((a, b) => a + b, 0);
  return Math.sqrt(ssum/arr.length);
};

/* Calculate RMS every 2s */
setInterval(() => {
  let lenRMSBuf = RMSBuffer.length;
  if (lenRMSBuf > 0) {
    let rms = CalculateRMS(RMSBuffer);
    RMSBuffer = RMSBuffer.slice(lenRMSBuf);
    RMSData.push(rms);
  }
}, 2000);