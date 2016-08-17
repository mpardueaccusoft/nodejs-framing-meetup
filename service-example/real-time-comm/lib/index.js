'use strict';

function Channel(socket) {
  this.socket = socket;
  this.socket.channel = this;

  if (!socket.handshake.session.sessionId) {
    socket.handshake.session.sessionId = socket.id;
    socket.handshake.session.save();
  }

  this.session = socket.handshake.session;

  console.log(`client ${socket.handshake.session.sessionId} connected`);

  this.socket.on('disconnect', () => this.closeChannel());
}

Channel.prototype.closeChannel = function () {
  console.log(`client ${this.socket.handshake.session.sessionId} disconnected`);
};

function CommServer(socketio, sessionMiddleware, cookieParser, httpServer, serverSession) {
  this.channels = new Set();
  this.io = socketio(httpServer);
  this.session = sessionMiddleware(serverSession, cookieParser());

  this.openNamespace('/');
}

CommServer.prototype.openNamespace = function (name) {
  return this.io.of(name).use(this.session)
    .on('connection', (socket) => this.openChannel(socket));
};

CommServer.prototype.closeChannel = function (channel) {
  this.channels.delete(channel);
};

CommServer.prototype.openChannel = function (socket) {
  const channel = new Channel(socket);
  this.channels.add(channel);

  socket.on('disconnect', () => this.closeChannel(channel));
};

module.exports.initialize = (imports) => {
  const comm = new CommServer(
    require('socket.io'),
    require('express-socket.io-session'),
    require('cookie-parser'),
    imports.server.httpServer,
    imports.server.session
  );

  return Promise.resolve(comm);
};