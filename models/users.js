'use strict';

const { log4js } = require('../utils/log4js');
const logger = log4js.getLogger('users');
const { client, turnConnection } = require('../services/postgres');

module.exports.getUsers = async () => {
    try {
        const users = await (await client.query('select * from users')).rows;
        logger.info(users);
        return users;
    } catch(error) {
        logger.error(error);
        turnConnection(false);
    }
}

module.exports.getUserById = async id => {
    try {
        const user = await (await client.query(`select * from users where id = ${id}`)).rows;
        logger.info(user);
        return user.pop();
    } catch(error) {
        logger.error(error);
        turnConnection(false);
    }
}

module.exports.createUser = async (id, user_name) => {
    try {
        client.query(`insert into users(id, state, user_name) values(${id}, 'START', '${user_name}')`);
        logger.info(`User with id: ${id} was created`);
    } catch(error) {
        logger.error(error);
        turnConnection(false);
    }
}

module.exports.changeState = async (id, state) => {
    try {
        client.query(`update users set state = '${state}' where id = ${id}`);
        logger.info(`State for user ${id} was updated to ${state}`);
    } catch(error) {
        logger.error(error);
        turnConnection(false);
    }
}

module.exports.insertCity = async (id, city) => {
    try {
        client.query(`update users set city = '${city}' where id = ${id}`);
        logger.info(`City for user ${id} was updated to ${city}`);
    } catch(error) {
        logger.error(error);
        turnConnection(false);
    }
}