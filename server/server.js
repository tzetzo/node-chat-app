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

io.on('connection', (socket) => { //the only time we use io.on
    console.log('new user connected');

    //send only to the newly connected user a welcome message:
    socket.emit('newMessage', {     //newMessage should correspond to the event name the client is listening for!
        from: 'Admin',
        text: 'Welcome to the chat app',
        createdAt: new Date().getTime()
    });
    //let all users know a new user joined(except the user who joined):
    socket.broadcast.emit('newMessage', {   //newMessage should correspond to the event name the client is listening for!
        from: 'Admin',
        text: 'New user joined',
        createdAt: new Date().getTime()
    });

    socket.on('createMessage', (message) => {
        console.log('createMessage', message);

        message.createdAt = new Date().getTime();
        io.emit('newMessage', message ) //emits an event to all connected to the server users
        //socket.broadcast.emit('newMessage', message) //emits an event to all connected users but the one who created the event
    });

    socket.on('disconnect', () => {
        console.log('client disconnected');
    });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
