var io = require('socket.io-client');
var $ = require('jquery');

var messages = null;

$(function () {
  messages = $('#messages');
});

io.connect('/chat')
  .on('a message', function (message) {
    messages.append(message + '<br>');
  });