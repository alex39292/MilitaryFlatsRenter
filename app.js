'use strict';

const yargs = require('yargs').argv;
const { log4js } = require('./utils/log4js');
const logger = log4js.getLogger('application');
const { startLoop, findHome } = require('./models/homes');
const { getUsers, getUserById, createUser, changeState, insertCity } = require('./models/users');
const { Telegraf } = require('telegraf');
const bot = new Telegraf(yargs.token);

startLoop();
