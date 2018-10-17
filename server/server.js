const express = require('express'); //3rd party library;
const path = require('path'); //build-in module; converts paths - 106 lesson
const http = require('http'); //build-in module; needed for socket.io
const socketIO = require('socket.io'); //3rd party library; has back-end & front-end library

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation'); //used for validating name & room strings
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public'); //resulting path node-chat-app/public;
const port = process.env.PORT || 3000; //declare the port; process.env.PORT is provided by heroku
const app = express(); //create express application
//create the http server:
const server = http.createServer(app);  //server needed for socket.io; 107 lesson
//create the websockets server:
//we also get access to the socket.io library for the front-end http://localhost:3000/socket.io/socket.io.js
const io = socketIO(server);  //configure the http server to use socket.io;
//create instance for saving connected sockets/users in array(124 lesson):
const users = new Users();

app.use(express.static(publicPath));  //the static web site

//new feature to get the currently available rooms for the new user to choose from:
app.get('/rooms', (req,res) => {
    res.send(users.getRoomsList());
});

//register built-in event listener;
//socket argument is same as socket in chat.js; represents an individual socket(one user):
io.on('connection', (socket) => { //the only time we use io.on;
    console.log('new user connected');

    //listen for custom event from browser;
    //new socket opens(new user joins);
    //params is object with name & room;
    //callback argument after params is used to acknowledge the request:
    socket.on('join', (params, callback) => {
        //verify name & room are strings & not empty with custom methods:
        if(!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required.');  //return used so following code does not get executed!
        }

        //https://socket.io/docs/rooms-and-namespaces/
        //socket.io has built-in support for isolated areas(rooms/channels)
        //where only certain people can emit & listen for events (122,123 lesson):
        socket.join(params.room); //join the room with the passed in name
        //socket.leave(params.room);  //leave the room with the passed in name
        //now io.emit() becomes io.to().emit()
        //now socket.broadcast.emit() becomes socket.broadcast.to().emit()
        //socket.emit() remains the same

        //remove & then add the user to the array of users currently connected:
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        //thanks to socket.join(params.room) we can now use to() in addition to specify room name;
        //send to all sockets in the specified room the new list of users (126 lesson):
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        //emit event only to the newly connected user:
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));  //newMessage should correspond to the event name the client is listening for!

        //thanks to socket.join(params.room) we can now use to() in addition to specify room name;
        //let all users in the specified room know a new user joined(except the user who joined):
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));   //newMessage should correspond to the event name the client is listening for!  //emits an event to all connected users but the one who created the event
        //send acknowledgement to the socket/browser:
        callback();
    });

    //127 lesson:
    socket.on('createMessage', (message, callback) => {
        // console.log('createMessage', message);
        const user = users.getUser(socket.id);

        if(user && isRealString(message.text)){
          //thanks to socket.join(params.room) we can now use to() in addition to specify room name:
          io.to(user.room).emit('newMessage', generateMessage(user.name, message.text) ); //emits an event to all connected to the server users
        }
        callback();  //sends back an acknowledgement to the user that his createMessage event was received
    });

    //127 lesson:
    socket.on('createLocationMessage', (coords, callback) => {
        const user = users.getUser(socket.id);
        if(user){
          //thanks to socket.join(params.room) we can now use to() in addition to specify room name:
          io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude)); //emits an event to all connected to the server users
        }
        callback(); //sends back an acknowledgement to the user that his createLocationMessage event was received
    });

    //register built-in event listener;
    //a socket/user disconnects;
    //socket is same as socket in chat.js; represents an individual socket(one user):
    socket.on('disconnect', () => {
        console.log('user disconnected');

        const user = users.removeUser(socket.id);
        if(user){
            //thanks to socket.join(params.room) we can now use to() in addition to specify room name;
            //send to all sockets in the specified room the new list of users (126 lesson):
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
