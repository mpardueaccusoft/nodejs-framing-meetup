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
Service.requires = ['DBConnection'];

function Factory(...serviceTypes) {
  this.services = {};
  serviceTypes.forEach((service) => this.services[service.name] = service);
}

Factory.prototype.createInstance = function (typeName) {
  const type = this.services[typeName];
  const serviceArgs = (type.requires || [])
    .map(typeName => this.createInstance(typeName));
  const typeConstructor = type.bind(null, ...serviceArgs);
  return new typeConstructor();
}

const factory = new Factory(Service, DBConnection);

const service = factory.createInstance('Service');

service.getData()
  .then(console.log);