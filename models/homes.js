'use strict';

const { getData } = require('../services/parser');
const { client, turnConnection } = require('../services/postgres');
const Emoji = require('./emoji');
const emoji = new Emoji();
const { getSubscribedUsers } = require('./users');

module.exports.startLoop = async observer => {
    try {
        await turnConnection();
        
        const ids = await getSubscribedUsers();
        if (ids.length !== 0) {
            ids.forEach(id => observer.subscribe(id.id));
        }

        console.log('Running loop...');
        const currentHomes = await getData();
        const homes = await getHomes();
        if (homes.join('') !== currentHomes.join('')) {
            await setHomes(currentHomes);
            observer.broadcast();
        } else {
            console.log('Data is the same');
        }
            
        await setInterval(async () => {
            console.log('Running loop...');
            const currentHomes = await getData();
            const homes = await getHomes();
            if (homes.join('') !== currentHomes.join('')) {
                await setHomes(currentHomes);
                observer.broadcast();
            } else {
                console.log('Data is the same');
            }
        }, 600000);
    } catch (error) {
        console.log(error);
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
        console.log(`Homes were updated. Added ${length} rows`);
    } catch (error) {
        console.log(error);
    }
}

const getHomes = async () => {
    try {
        const homes = await (await client.query('select * from homes')).rows;
        return homes;
    } catch (error) {
        console.log(error);
    }
}
module.exports.getHomes = getHomes;

module.exports.findHome = async address => {
    try {
        address = `.${address}`;
        const homes = await getHomes();
        const result = homes.filter(home => home.address.toUpperCase().includes(address.toUpperCase()));
        return makeMessage(result);
    } catch (error) {
        console.log(error);
    }
}

function makeMessage(result) {
    let message = '';
    if (result.length !== 0) {
    console.log(`${result.length} homes sent`);
    result.forEach(home => {
message += `${emoji.generateNumberToSticker(result.indexOf(home) + 1)} ${home.address}
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
