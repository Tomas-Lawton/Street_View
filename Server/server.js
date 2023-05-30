const express = require("express");
const cors = require("cors");
var _ = require('lodash');

const app = express();
app.use(cors({ origin: "http://localhost:8081" }));
app.use(cors({ origin: "https://static-ai-street-view.onrender.com" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    // origins: ['http://localhost:8081', "https://static-ai-street-view.onrender.com"]
    origins: ["*"]
  }
});

const config = require('./conf.js');
const path = __dirname + '/app/views/';
const PORT = process.env.PORT || 8080;
console.log(PORT)

let connections = [];
let markers = [];
let position = { lat: 0, lng: 0 };
let pov = { heading: 0, pitch: 0 }

io.on('connection', (socket) => {
  // Connect and load markers for joining clients
  console.log('connected id: ', socket.id);
  connections.push(socket);
  for (let i = 0; i < markers.length; i++) {
    socket.emit("marker", markers[i]);
  }

  // Changing position
  socket.on("position", data => {
    if (!_.isEqual(position, data)) {
      position = data;
      socket.broadcast.emit("position", data);
      console.log("Position changed to: ", data);
    }
  });

  // Changing view
  socket.on("pov", data => {
    if (!_.isEqual(pov, data)) {
      position = data;
      socket.broadcast.emit("pov", data);
      console.log("Pov changed to: ", data);
    }
  });

  // Adding new marker
  socket.on("marker", data => {
    markers.push(data);
    console.log("Added marker: ", markers.length);
    console.log("Markers: ", markers)
    socket.broadcast.emit("marker", data);
  });

  // Delete marker at index
  socket.on("delete", data => {
    markers.splice(data.index, 1);
    console.log("Deleted marker: ", data.index);
    console.log("Markers: ", markers)
    socket.broadcast.emit("delete", data);
  });

  // Reposition marker at index
  socket.on("reposition", data => {
    console.log("Moved marker: ", data);
    markers[data.id].position = data.position
    socket.broadcast.emit("reposition", data);
  });

  // Reset
  socket.on("clear", () => {
    console.log("Cleared markers");
    markers = [];
    socket.broadcast.emit("clear");
  });
  socket.on("controlling", data => {
    console.log("Controlling changed to: ", data);
    socket.broadcast.emit("controlling", data);
  });

  socket.on('disconnect', () => {
    console.log('disconnected user:', socket.id);
    if (connections.length === 0) {
      markers = []
    }
  });

  socket.on("login", fromView => {
    console.log("logged in: ", fromView);
  });

});

http.listen(PORT, () => console.log('server running on port', PORT));

module.exports = app;
