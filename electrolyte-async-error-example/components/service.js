'use strict';

let requestData = () => new Promise(resolve => setTimeout(resolve.bind(null, 'Hello, World!'), 250));

exports = module.exports = () => {
  let _data = null;
  requestData()
    .then(data => _data = data);

  return {
    getData: () => new Promise((resolve, reject) => _data ? resolve(_data) : reject(new Error('Data not retrieved yet.')))
  };
}

exports['@singleton'] = true;