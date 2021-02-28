'use strict';

const { log4js } = require('../utils/log4js');
const logger = log4js.getLogger('users');
const { client, turnConnection } = require('../services/postgres');

//changeState(168305743, 'RUN');
//insertCity(168305743, 'Минск');
createUser(1693, 'from vscode');
//getUsers();
//getUserById(1683057433);

async function getUsers() {
    turnConnection({action: 'on'});
    const users = await (await client.query('select * from users')).rows;
    turnConnection({action: 'off'});
    logger.info(users);
    return users;
}

async function getUserById(id) {
    turnConnection({action: 'on'});
    const user = await (await client.query(`select * from users where id = ${id}`)).rows;
    turnConnection({action: 'off'});
    logger.info(user);
    return user;
}

async function createUser(id, user_name) {
    //turnConnection({action: 'on'});
    client.query(`insert into users(id, state, user_name) values(${id}, 'START', '${user_name}')`);
    logger.info(`User with id: ${id} was created`);
    turnConnection({action: 'off'});
}

async function changeState(id, state) {
    turnConnection({action: 'on'});
    client.query(`update users set state = '${state}' where id = ${id}`);
    logger.info(`State for user ${id} was updated to ${state}`);
    turnConnection({action: 'off'});
}

async function insertCity(id, city) {
    turnConnection({action: 'on'});
    client.query(`update users set city = '${city}' where id = ${id}`);
    logger.info(`City for user ${id} was updated to ${city}`);
    turnConnection({action: 'off'});
}
