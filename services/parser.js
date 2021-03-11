'use strict';

const axios = require('axios');
const cheerio = require('cheerio');
const parser = require('../configs/parser.json');
const { log4js } = require('../utils/log4js');
const logger = log4js.getLogger('parser')

module.exports.getData = async () => {
    const homes = [];
    const response = await getDOM();
    const $ = cheerio.load(response.data);
    const fromResponse = {
        'id': getElementsBy(parser.selectors.id),
        'address': getElementsBy(parser.selectors.address),
        'floor': getElementsBy(parser.selectors.floor),
        'flats': getElementsBy(parser.selectors.flats),
        'area': getElementsBy(parser.selectors.area),
        'deadLine': getElementsBy(parser.selectors.deadLine),
        'notes': getElementsBy(parser.selectors.other),
    };
    logger.info(`Got ${fromResponse.id.length} homes from response`);
    
    while (fromResponse.id.length !== 0) {
        homes.push({
            'id': fromResponse.id.shift(),
            'address': fromResponse.address.shift(),
            'floor': fromResponse.floor.shift(),
            'flats': fromResponse.flats.shift(),
            'area': fromResponse.area.shift(),
            'deadLine': fromResponse.deadLine.shift(),
            'notes': fromResponse.notes.shift(),
        });
    }

    function getElementsBy(selector) {
        return $(selector).toArray().map(elem => $(elem).text().trim());
    }

    return homes;
}

async function getDOM() {
    try {
        return await axios.get(parser.url);
    } catch (error) {
        logger.error(error);
    }
}