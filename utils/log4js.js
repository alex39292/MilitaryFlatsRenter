'use strict';

const log4js_config = require('../configs/log4js.json');

module.exports.log4js = require('log4js').configure(log4js_config);