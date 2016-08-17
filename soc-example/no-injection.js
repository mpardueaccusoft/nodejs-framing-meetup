'use strict';

function DBConnection() {
  // connection information

  this.getData = () => Promise.resolve([ 'data' ]);
}

function Service() {
  this.connection = new DBConnection();
}

Service.prototype.getData = function () {
  return this.connection.getData();
}

const service = new Service();
service.getData()
  .then(console.log);