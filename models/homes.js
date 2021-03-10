'use strict';

const { log4js } = require('../utils/log4js');
const logger = log4js.getLogger('homes');
const { getData } = require('../services/parser');
const { client, turnConnection } = require('../services/postgres');
const Emoji = require('./emoji');
const emoji = new Emoji();
const { getSubscribedUsers } = require('./users');

module.exports.startLoop = async (observer, func) => {
    try {
        await turnConnection(true);
        
        const ids = await getSubscribedUsers();
        if (ids.length !== 0) {
        for(let id of ids) {
            observer.subscribe({
                id: id,
                func: func
            });
            }
        }
            
        await setInterval(async () => {
            logger.info('Running loop...');
            const currentHomes = await getData();
            const homes = await getHomes();
            if (homes.join('') !== currentHomes.join('')) {
                await setHomes(currentHomes);
                observer.broadcast();
            } else {
                logger.info('Data is the same');
            }
        }, 60000);
    } catch (error) {
        logger.error(error);
        await turnConnection(false);
    }
}

async function setHomes(homes) {
    try {
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
    } catch (error) {
        logger.error(error);
        turnConnection(false);
    }
}

async function getHomes() {
    try {
        const homes = await (await client.query('select * from homes')).rows;
        return homes;
    } catch (error) {
        logger.error(error);
        turnConnection(false);
    }
}

module.exports.findHome = async address => {
    try {
        address = `.${address}`;
        const homes = await getHomes();
        const result = homes.filter(home => home.address.toUpperCase().includes(address.toUpperCase()));
        logger.info(`${result.length} homes sent`);
        return makeMessage(result);
    } catch (error) {
        logger.error(error);
        turnConnection(false);
    }
}

function makeMessage(result) {
    let message = '';
    if (result.length !== 0) {
    result.forEach(home => {
message += `${emoji.generateNumberToSticker(result.indexOf(home) + 1)}. ${home.address}
Комнат: ${home.flats}
Этаж: ${home.floor}
Площадь: ${home.area}
${emoji.generateDate()} ${home.deadline}
${emoji.generateZap()} ${home.notes}
        
`;
});
    }
    return message;
}