const express = require('express'); //import express
const path = require('path'); //import path module
const http = require('http'); //needed for socket.io
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000; //declare the port; process.env.PORT is provided by heroku
const app = express(); //create express application
const server = http.createServer(app);  //server needed for socket.io
const io = socketIO(server);  //the websockets server

app.use(express.static(publicPath));  //the static web site

io.on('connection', (socket) => {
    console.log('new user connected');

    socket.on('disconnect', () => {
        console.log('client disconnected');
    });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
