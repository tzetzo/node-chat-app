const socket = io();

socket.on('connect', function () {
    console.log('connected to server');
});

socket.on('disconnect', function () {
    console.log('disconnected from server');
});

socket.on('newMessage', function (message) {
  console.log('newMessage: ', message);
  $('#messages').append(`<li>${message.from} : ${message.text}</li>`);
});

$('#message-form').on('submit', function(e){
    e.preventDefault(); //prevent the default behaviour of the form which is to get send

    socket.emit('createMessage', {
      from: 'User',
      text: $('[name=message]').val()
    }, function(acknow) {     //acknowledgement from the server that the createMessage event was received
        console.log('Got it!', acknow);
    });

});
