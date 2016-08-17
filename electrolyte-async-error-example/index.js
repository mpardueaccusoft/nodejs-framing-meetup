'use strict';

const IoC = require('electrolyte');

IoC.use(IoC.dir('./components'));
 
IoC.create('client');