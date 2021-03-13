'use strict';

const { log4js } = require('../utils/log4js');
const logger = log4js.getLogger('users');
const { client, turnConnection } = require('../services/postgres');

module.exports.getSubscribedUsers = async () => {
    try {
        let ids = [];
        ids = await (await client.query('select id from users where state = \'SUBSCRIBED\'')).rows;
        return ids;
    } catch(error) {
        logger.error(error);
    }
}

module.exports.getUsers = async () => {
    try {
        let users = [];
        users = await (await client.query('select * from users')).rows;
        return users;
    } catch(error) {
        logger.error(error);
    }
}

module.exports.getCityById = async id => {
    try {
        return await (await client.query(`select city from users where id = ${id}`)).rows.pop().city;
    } catch(error) {
        logger.error(error);
    }
}

module.exports.createUser = async (id, user_name) => {
    try {
        client.query(`insert into users(id, state, user_name) values(${id}, 'START', '${user_name}')`);
        logger.info(`User with id: ${id} was created`);
    } catch(error) {
        logger.error(error);
    }
}

module.exports.changeState = async (id, state) => {
    try {
        client.query(`update users set state = '${state}' where id = ${id}`);
        logger.info(`State for user ${id} was updated to ${state}`);
    } catch(error) {
        logger.error(error);
    }
}

module.exports.setCity = async (id, city) => {
    try {
        client.query(`update users set city = '${city}' where id = ${id}`);
        logger.info(`City for user ${id} was updated to ${city}`);
    } catch(error) {
        logger.error(error);
    }
}