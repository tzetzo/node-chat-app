const express = require('express'); //import express
const path = require('path'); //import path module
const http = require('http'); //needed for socket.io
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000; //declare the port; process.env.PORT is provided by heroku
const app = express(); //create express application
const server = http.createServer(app);  //server needed for socket.io
const io = socketIO(server);  //the websockets server
const users = new Users();

app.use(express.static(publicPath));  //the static web site

io.on('connection', (socket) => { //the only time we use io.on
    console.log('new user connected');

    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required.');  //return used so following code does not get executed!
        }

        socket.join(params.room); //join the room with the passed in name
        //socket.leave(params.room);  //leave the room with the passed in name
        //remove & then add the user to the array of users currently connected:
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        //send only to the newly connected user a welcome message:
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));  //newMessage should correspond to the event name the client is listening for!
        //let all users know a new user joined(except the user who joined):
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));   //newMessage should correspond to the event name the client is listening for!  //emits an event to all connected users but the one who created the event
        callback();
    });

    socket.on('createMessage', (message, callback) => {
        // console.log('createMessage', message);
        const user = users.getUser(socket.id);

        if(user && isRealString(message.text)){
          io.to(user.room).emit('newMessage', generateMessage(user.name, message.text) ); //emits an event to all connected to the server users
        }
        callback();  //sends back an acknowledgement to the user that his createMessage event was received
    });

    socket.on('createLocationMessage', (coords, callback) => {
        const user = users.getUser(socket.id);
        if(user){
          io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude)); //emits an event to all connected to the server users
        }
        callback(); //sends back an acknowledgement to the user that his createLocationMessage event was received
    });

    socket.on('disconnect', () => {
        //console.log('client disconnected');
        const user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
