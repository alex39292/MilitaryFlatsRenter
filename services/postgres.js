'use strict';

const { Client } = require('pg');
const options = require('../configs/postgres.json');
const { log4js } = require('../utils/log4js');
const logger = log4js.getLogger('postgres');

const client = new Client(options);
module.exports.client = client;

module.exports.turnConnection = async (flag) => {
    try {
        if (flag) {
            await client.connect();
            logger.info('Connected to DataBase');
        } else {
            await client.end();
            logger.info('Connection closed');
        }
    } catch (error) {
        await client.end();
        logger.error(error);
    }
}