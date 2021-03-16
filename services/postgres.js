'use strict';

const { Client } = require('pg');
const options = require('../configs/postgres');
const { log4js } = require('../utils/log4js');
const logger = log4js.getLogger('postgres');

const client = new Client(options);
module.exports.client = client;

module.exports.turnConnection = async () => {
    try {
            await client.connect();
            logger.info('Connected to DataBase');
    } catch (error) {
        await client.end();
        logger.error(error);
        console.log(error);
    }
}