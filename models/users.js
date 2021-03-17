'use strict';

const { client } = require('../services/postgres');

module.exports.getSubscribedUsers = async () => {
    try {
        let ids = [];
        ids = await (await client.query('select id from users where state = \'SUBSCRIBED\'')).rows;
        return ids;
    } catch(error) {
        console.log(error);
    }
}

module.exports.getUsersId = async () => {
    try {
        let ids = [];
        ids = await (await client.query('select id from users')).rows.map(id => id.id);
        return ids;
    } catch(error) {
        console.log(error);
    }
}

module.exports.getUsers = async () => {
    try {
        let users = [];
        users = await (await client.query('select * from users')).rows;
        return users;
    } catch(error) {
        console.log(error);
    }
}

module.exports.getCityById = async id => {
    try {
        return await (await client.query(`select city from users where id = ${id}`)).rows.pop().city;
    } catch(error) {
        console.log(error);
    }
}

module.exports.createUser = async (id, user_name) => {
    try {
        client.query(`insert into users(id, state, user_name) values(${id}, 'START', '${user_name}')`);
        console.log(`User with id: ${id} was created`);
    } catch(error) {
        console.log(error);
    }
}

module.exports.deleteUser = async id => {
    try {
        return await (await client.query(`delete from users where id = ${id}`));
    } catch(error) {
        console.log(error);
    }
}

module.exports.changeState = async (id, state) => {
    try {
        const userState = await (await client.query(`select state from users where id = ${id}`)).rows.pop().state;
        if (userState !== state) {
            await client.query(`update users set state = '${state}' where id = ${id}`);
            console.log(`State for user ${id} was updated to ${state}`);
        }
    } catch(error) {
        console.log(error);
    }
}

module.exports.setCity = async (id, city) => {
    try {
        client.query(`update users set city = '${city}' where id = ${id}`);
        console.log(`City for user ${id} was updated to ${city}`);
    } catch(error) {
        console.log(error);
    }
}