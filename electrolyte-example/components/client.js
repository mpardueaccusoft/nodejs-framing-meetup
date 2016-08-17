'use strict';

exports = module.exports = (service) => {
  service.getData()
    .then(console.log);
};

exports['@singleton'] = true;
exports['@require'] = [ 'service' ];