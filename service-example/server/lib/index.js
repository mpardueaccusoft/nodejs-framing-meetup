'use strict';

function Server(http, express, sessionMiddleware, cookieParser, sessionStore, options) {
  this.app = express();
  this.server = http.Server(this.app);
  this.session = sessionMiddleware({
    store: new sessionStore(),
    secret: options.session.secret,
    resave: true,
    saveUninitialized: true
  });
  this.app.use(cookieParser(options.session.secret));
  this.app.use(this.session);

  this.options = options;
}

Server.prototype.initialize = function (options = {}) {
  return new Promise((resolve, reject) => {
    this.server.listen(this.options.port || options.port, (error) => {
      if (error) {
        return reject(error);
      }

      resolve();
    });
  });
};

module.exports.initialize = () => {
  const express = require('express');
  const server = new Server(
    require('http'),
    require('express'),
    require('express-session'),
    require('cookie-parser'),
    require('./session-store'),
    {
      port: 8080,
      session: {
        secret: 'my-secret'
      }
    }
  );

  return server.initialize()
    .then(() => {
      return {
        middleware: {
          static: express.static
        },
        httpServer: server.server,
        app: server.app,
        session: server.session
      };
    });
};