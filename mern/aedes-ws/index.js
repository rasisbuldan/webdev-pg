// -----------------------------------------
// * MySQL initialization
var mysql = require('mysql');
var dbConnection = mysql.createConnection({
  host: 'localhost',
  user: 'demo',
  password: 'password',
  database: 'demo_sensor'
});
dbConnection.connect();

// * Check connection
dbConnection.query('SELECT 1', function (error, results, fields) {
  if (error) {
    throw error;
  }
  else {
    console.log('[MySQL] Connected!');
  }
});

// Aedes module import
const aedes = require('aedes')();

// ---------------------------------------
// Config for normal mqtt
const server = require('net').createServer(aedes.handle);
const brokerPort = 1884;

// API for normal mqtt
server.listen(brokerPort, () => {
  console.log(`[Aedes] Broker started and listening to port ${brokerPort}`);
});

// * Insert into database if broker receives message
aedes.on('publish', async function(packet, client) {
  // Extract payload information
  topic = packet.topic;
  msg = packet.payload.toString();
  console.log(`[Payload] ${packet.topic} : ${packet.payload.toString()}`);

  if (topic.includes("$SYS")) {
    // Topic besides published message (connection, heartbeat, etc)
  }
  else {
    // Query for mysql
    dbConnection.query(`INSERT INTO sensors (sensor,val) VALUES ('${topic}',${msg})`, function(err,results,field) {
      if (err) {
        throw err;
      }
      // Print number of rows affected
      else {
        console.log(`Insert ${results.affectedRows} record(s) successful with id ${results.insertId}!`);
      }
    });
  }
});


// ----------------------------------------
// Config for websocket
const httpServer = require('http').createServer();
const ws = require('websocket-stream');
const port = 8000;

// Create websocket connection
ws.createServer({ 
  server: httpServer 
}, aedes.handle);

httpServer.listen(port, function () {
  console.log('websocket server listening on port ', port)
});


// ----------------------------------------
// Express server -> serve static files
const express = require('express');
const app = express();
const PORT = 3001; // website port

// Static folder location
app.use(express.static('public'));

// Run server
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));


