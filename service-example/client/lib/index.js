'use strict';

module.exports.initialize = (imports) => {
  const app = imports.server.app;
  const nunjucks = require('nunjucks');
  const path =  require('path');

  nunjucks.configure(path.join(__dirname, '/../views/'), {
    express: app,
    autoescape: true
  });

  app.set('view engine', 'html');

  app.use(imports.server.middleware.static(path.join(__dirname, '/../dist')));

  app.get('/', (req, res) => {
    return res.render('index.html', { message: 'Hello, World!'});
  });

  return Promise.resolve();
};