const express = require('express'); //import express
const path = require('path'); //import path module
const http = require('http'); //needed for socket.io
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000; //declare the port; process.env.PORT is provided by heroku
const app = express(); //create express application
const server = http.createServer(app);  //server needed for socket.io
const io = socketIO(server);  //the websockets server

app.use(express.static(publicPath));  //the static web site

io.on('connection', (socket) => { //the only time we use io.on
    console.log('new user connected');

    //send only to the newly connected user a welcome message:
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));  //newMessage should correspond to the event name the client is listening for!

    //let all users know a new user joined(except the user who joined):
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));   //newMessage should correspond to the event name the client is listening for!  //emits an event to all connected users but the one who created the event

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message.from, message.text) ); //emits an event to all connected to the server users
        callback();  //sends back an acknowledgement to the user that his createMessage event was received
    });

    socket.on('createLocationMessage', (coords, callback) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude)); //emits an event to all connected to the server users
        callback(); //sends back an acknowledgement to the user that his createLocationMessage event was received
    });

    socket.on('disconnect', () => {
        console.log('client disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
