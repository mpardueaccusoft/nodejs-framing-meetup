'use strict';

let requestData = () => new Promise(resolve => setTimeout(resolve.bind(null, 'Hello, World!'), 1000));

module.exports.initialize = () => {
  return requestData()
    .then((data) => ({
      getData: () => Promise.resolve(data) 
    }));
}

module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error());
    }, 250);
  });
};