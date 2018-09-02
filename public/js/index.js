const socket = io();

socket.on('connect', function () {
    console.log('connected to server');

    // socket.emit('createMessage', {
    //   to: 'lili@example.com',
    //   text: 'hey this is tzetzo'
    // });

});

socket.on('disconnect', function () {
    console.log('disconnected from server');
});

socket.on('newMessage', function (message) {
  console.log('newMessage: ', message);
});
