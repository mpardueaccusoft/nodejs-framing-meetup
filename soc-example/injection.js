'use strict';

function DBConnection() {
  // connection information

  this.getData = () => Promise.resolve([ 'data' ]);
}

function Service(connection) {
  this.connection = connection;
}

Service.prototype.getData = function () {
  return this.connection.getData();
}

const service = new Service(new DBConnection());
service.getData()
  .then(console.log);