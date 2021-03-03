'use strict';

const { log4js } = require('./utils/log4js');
const logger = log4js.getLogger('application');
const { startLoop, findHome } = require('./models/homes');
const { getUsers, getUserById, createUser, changeState, insertCity } = require('./models/users');
const { Telegraf } = require('telegraf');
const bot = new Telegraf();

startLoop();
