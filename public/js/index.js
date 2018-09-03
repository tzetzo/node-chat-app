const socket = io();

socket.on('connect', function () {
    console.log('connected to server');
});

socket.on('disconnect', function () {
    console.log('disconnected from server');
});

socket.on('newMessage', function (message) {
    const formattedTime = moment(message.createdOn).format('h:mm a');
    //console.log('newMessage: ', message);
    //$('#messages').append(`<li>${message.from} : ${message.text}</li>`);  //introduces the ability of attacker injecting malicious code!
    const li = $('<li></li>');
    li.text(`${message.from} ${formattedTime}: ${message.text}`);
    $('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
    const formattedTime = moment(message.createdOn).format('h:mm a');
    //console.log('newLocationMessage: ', message);
    //$('#messages').append(`<li>${message.from} : <a href="${message.url}" target="_blank">My current location</a></li>`); //introduces the ability of attacker injecting malicious code!
    const li = $('<li></li>');
    const a = $('<a target="_blank">My current location</a>');

    li.text(`${message.from} ${formattedTime}: `);
    a.attr('href', message.url);
    li.append(a);
    $('#messages').append(li);
});

$('#message-form').on('submit', function(e){
    e.preventDefault(); //prevent the default behaviour of the form which is to get send

    const messageTextBox = $('[name=message]');

    socket.emit('createMessage', {
      from: 'User',
      text: messageTextBox.val()
    }, function(acknow) {     //acknowledgement from the server that the createMessage event was received
        messageTextBox.val(''); //clear the input after receiving the acknowledgement from the server
    });

});

const locationButton = $('#send-location');
locationButton.on('click', function(e) {

    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }

    locationButton.prop('disabled',true).text('Sending location...');

    navigator.geolocation.getCurrentPosition(function (position) {

        socket.emit('createLocationMessage', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }, function(acknow) {     //acknowledgement from the server that the createMessage event was received
          locationButton.prop('disabled',false).text('Send location');
        });

    }, function () {
        alert('Unable to fetch location.');
        locationButton.prop('disabled',false).text('Send location');
    });
});
