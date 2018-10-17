//make request to server to open websocket connection and keep it open;
//socket is used to send/receive data to/from the server:
const socket = io(); //available through socket.io.js loaded in chat.html

//determine wetther to scroll the user to the bottom depending on their position:
function scrollToBottom() { //120 lesson
    //Selectors
    const messages = $('#messages');
    const newMessage = messages.children('li:last-child');
    //Heights
    const clientHeight = messages.prop('clientHeight'); //using jQuery method
    const scrollTop = messages.prop('scrollTop');
    const scrollHeight = messages.prop('scrollHeight');
    const newMessageHeight = newMessage.innerHeight();
    const lastMessageHeight = newMessage.prev().innerHeight();

    //scroll the user to the bottom:
    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
      messages.scrollTop(scrollHeight);
    }
    //my version:
    // if (scrollHeight - scrollTop - clientHeight < 110) {
    //   messages.scrollTop(scrollHeight);
    // }
}

//register built-in event listener:
socket.on('connect', function () {  //with arrow function it might not work on IE, mobile
    console.log('server connected');

    //extract from URL the query params name & room as an object (122 lesson);
    //https://gist.github.com/andrewjmead/b71e03d8df237983285892f9a265d401:
    const params = $.deparam();
    //emit custom event after we are connected;
    //send the extracted params to the server;
    //callback receives the acknowledgement from the server
    socket.emit('join', params, function(data) {
        if(data) {
            alert(data);
            window.location.href = '/';
        } else {
            console.log('Successfully joined.');
        }
    });
});

//register built-in event listener:
socket.on('disconnect', function () {
    console.log('server disconnected');
});

//we receive an array of all the users (126 lesson):
socket.on('updateUserList', function (users) {
    const ol = $('<ol></ol>');
    users.forEach(function(user){
        ol.append($('<li></li>').text(user));
    });
    //replace the list with the new version:
    $('#users').html(ol);
});

socket.on('newMessage', function (message) {
    const formattedTime = moment(message.createdOn).format('h:mm a');

    const template = $('#message-template').html(); //get the template & its markup from chat.html
    const html = Mustache.render(template, {  //render the template with the data used by the template
        text: message.text,
        from: message.from,
        createdOn: formattedTime
    });

    $('#messages').append(html);  //put the Mustache rendered template in the selected DOM element
    scrollToBottom();

    // const formattedTime = moment(message.createdOn).format('h:mm a');
    // //console.log('newMessage: ', message);
    // //$('#messages').append(`<li>${message.from} : ${message.text}</li>`);  //introduces the ability of attacker injecting malicious code!
    // const li = $('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);
    // $('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
  const formattedTime = moment(message.createdOn).format('h:mm a');

  const template = $('#location-message-template').html(); //get the template & its markup from index.html
  const html = Mustache.render(template, {  //render the template with the data used by the template
      url: message.url,
      from: message.from,
      createdOn: formattedTime
  });

  $('#messages').append(html);  //put the Mustache rendered template in the selected DOM element
  scrollToBottom();

    // const formattedTime = moment(message.createdOn).format('h:mm a');
    // //console.log('newLocationMessage: ', message);
    // //$('#messages').append(`<li>${message.from} : <a href="${message.url}" target="_blank">My current location</a></li>`); //introduces the ability of attacker injecting malicious code!
    // const li = $('<li></li>');
    // const a = $('<a target="_blank">My current location</a>');
    //
    // li.text(`${message.from} ${formattedTime}: `);
    // a.attr('href', message.url);
    // li.append(a);
    // $('#messages').append(li);
});

//detect form submission, grab message & emit event:
$('#message-form').on('submit', function(e){
    //prevent the default behaviour of the form which is to get send & refresh page:
    e.preventDefault();
    //get the input field:
    const messageTextBox = $('[name=message]');

    socket.emit('createMessage', {
      text: messageTextBox.val()
    }, function(acknow) {     //acknowledgement from the server that the createMessage event was received
        messageTextBox.val(''); //clear the input after receiving the acknowledgement from the server
    });

});

//get browser location & emit custom event sending it to the server:
const locationButton = $('#send-location'); //avoid making jQuery call multiple times!
locationButton.on('click', function(e) {
    //check browser support:
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.'); //prevent the rest of the function from execution
    }

    locationButton.prop('disabled',true).text('Sending location...');
    //get browser location:
    navigator.geolocation.getCurrentPosition(function (position) {

        socket.emit('createLocationMessage', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }, function(acknow) {     //acknowledgement from the server that the createLocationMessage event was received
          locationButton.prop('disabled',false).text('Send location');
        });

    }, function () {
        alert('Unable to fetch location.');
        locationButton.prop('disabled',false).text('Send location');
    });
});
