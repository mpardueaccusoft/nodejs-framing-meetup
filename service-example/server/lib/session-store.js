/*!
 * express-session
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */

var Store = require('express-session').Store;
var util = require('util');

let fs = require('fs');

/**
 * Shim setImmediate for node.js < 0.10
 * @private
 */

/* istanbul ignore next */
var defer = typeof setImmediate === 'function'
  ? setImmediate
  : function(fn){ process.nextTick(fn.bind.apply(fn, arguments)); };

/**
 * Module exports.
 */

module.exports = SessionStore;

/**
 * A session store in memory.
 * @public
 */

function SessionStore() {
  Store.call(this);
  this.sessions = Object.create(null);
}

/**
 * Inherit from Store.
 */

util.inherits(SessionStore, Store);

/**
 * Get all active sessions.
 *
 * @param {function} callback
 * @public
 */

SessionStore.prototype.all = function all(callback) {
  var sessionIds = Object.keys(this.sessions);
  var sessions = Object.create(null);

  for (var i = 0; i < sessionIds.length; i++) {
    var sessionId = sessionIds[i];
    var session = getSession.call(this, sessionId);

    if (session) {
      sessions[sessionId] = session;
    }
  }

  callback && defer(callback, null, sessions);
};

/**
 * Clear all sessions.
 *
 * @param {function} callback
 * @public
 */

SessionStore.prototype.clear = function clear(callback) {
  this.sessions = Object.create(null);
  callback && defer(callback);
};

/**
 * Destroy the session associated with the given session ID.
 *
 * @param {string} sessionId
 * @public
 */

SessionStore.prototype.destroy = function destroy(sessionId, callback) {
  delete this.sessions[sessionId];
  callback && defer(callback);
};

/**
 * Fetch session by the given session ID.
 *
 * @param {string} sessionId
 * @param {function} callback
 * @public
 */

SessionStore.prototype.get = function get(sessionId, callback) {
  if (Object.keys(this.sessions).length === 0) {
    fs.readFile('./sessions.txt', 'utf8', (error, data) => {
      if (error && error.code !== 'ENOENT') {
        return callback(error);
      }
      if (data) {
        this.sessions = JSON.parse(data);
      }
      defer(callback, null, getSession.call(this, sessionId));
    });
  } else {
    defer(callback, null, getSession.call(this, sessionId));
  }
};

/**
 * Commit the given session associated with the given sessionId to the store.
 *
 * @param {string} sessionId
 * @param {object} session
 * @param {function} callback
 * @public
 */

SessionStore.prototype.set = function set(sessionId, session, callback) {
  this.sessions[sessionId] = JSON.stringify(session);
  fs.writeFile('./sessions.txt', JSON.stringify(this.sessions, null, 2), 'utf8', () => {
    callback && defer(callback);
  });
};

/**
 * Get number of active sessions.
 *
 * @param {function} callback
 * @public
 */

SessionStore.prototype.length = function length(callback) {
  this.all(function (err, sessions) {
    if (err) return callback(err);
    callback(null, Object.keys(sessions).length);
  });
};

/**
 * Touch the given session object associated with the given session ID.
 *
 * @param {string} sessionId
 * @param {object} session
 * @param {function} callback
 * @public
 */

SessionStore.prototype.touch = function touch(sessionId, session, callback) {
  var currentSession = getSession.call(this, sessionId);

  if (currentSession) {
    // update expiration
    currentSession.cookie = session.cookie;
    this.sessions[sessionId] = JSON.stringify(currentSession);
  }

  callback && defer(callback);
};

/**
 * Get session from the store.
 * @private
 */

function getSession(sessionId) {
  var sess = this.sessions[sessionId];

  if (!sess) {
    return;
  }

  // parse
  sess = JSON.parse(sess);

  var expires = typeof sess.cookie.expires === 'string'
    ? new Date(sess.cookie.expires)
    : sess.cookie.expires;

  // destroy expired session
  if (expires && expires <= Date.now()) {
    delete this.sessions[sessionId];
    return;
  }

  return sess;
}