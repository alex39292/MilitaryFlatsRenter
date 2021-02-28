'use strict';

const { log4js } = require('../utils/log4js');
const logger = log4js.getLogger('homes');
const { getData } = require('../services/parser');
const { client, turnConnection } = require('../services/postgres');

//updateAndGetHomes();
//findHome('лидА');


async function updateAndGetHomes() {
    try {
    await turnConnection({action: 'on'});
    await updateHomes();
    await getHomes();
    } catch (error) {
        logger.error(error);
    } finally {
        await turnConnection({action: 'off'});
    }
}

async function updateHomes() {
    const homes = await getData();
    const length = homes.length;
    client.query('truncate homes');
    while (homes.length != 0) {
        const home = homes.shift();
        const query = {
            text: "insert into homes(id, address, floor, flats, area, deadline, notes) values($1, $2, $3, $4, $5, $6, $7)",
            values: [home.id, home.address, home.floor, home.flats, home.area, home.deadLine, home.notes]
        }
        client.query(query);
    }
    logger.info(`Homes were updated. Added ${length} rows`);
}

async function getHomes() {
    const homes = await (await client.query('select * from homes')).rows;
    logger.info(homes);
    return homes;
}

async function findHome(address) {
    const field = `.${address}`;
    turnConnection({action: 'on'});
    const homes = await getHomes();
    const result = homes.filter(home => home.address.toUpperCase().includes(address.toUpperCase()));
    logger.info(result);
    turnConnection({action: 'off'});
    return result;
}