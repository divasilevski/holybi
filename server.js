const express = require("express");
const serveStatic = require("serve-static");
const path = require("path");
const socketIO = require('socket.io');

const app = express();

app.use("/", serveStatic(path.join(__dirname, "/dist")));

const port = process.env.PORT || 8080;
app.listen(port);

console.log(`Listening on port: ${port}`);

const io = socketIO(app);

io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
  });
  
  setInterval(() => io.emit('time', new Date().toTimeString()), 1000);