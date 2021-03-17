'use strict';

const { Client } = require('pg');
const options = require('../configs/postgres');

const client = new Client(options);
module.exports.client = client;

module.exports.turnConnection = async () => {
    try {
            await client.connect();
            console.log('Connected to DataBase');
    } catch (error) {
        await client.end();
        console.log(error);
    }
}