'use strict';

module.exports.initialize = (imports) => {
  imports.service.getData()
    .then(console.log, console.log);
};