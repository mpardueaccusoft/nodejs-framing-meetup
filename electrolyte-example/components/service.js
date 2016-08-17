'use strict';

exports = module.exports = () => {
  return {
    getData: () => Promise.resolve('Hello, World!')
  };
}

exports['@singleton'] = true;