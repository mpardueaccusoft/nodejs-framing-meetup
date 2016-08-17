'use strict';

module.exports.initialize = (imports) => {
  const comm = imports['real-time-comm'];

  const chat = comm.openNamespace('/chat')
    .on('connection', (socket) => {
      socket.emit('a message', 'hi!');
      chat.emit('a message', `${socket.channel.session.id} joined.`);
    });

  return Promise.resolve();
};