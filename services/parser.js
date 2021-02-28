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
    const id = getElementsBy(parser.selectors.id);
    logger.info(`Get ${id.length} homes from response`);
    const address = getElementsBy(parser.selectors.address);
    const floor = getElementsBy(parser.selectors.floor);
    const flats = getElementsBy(parser.selectors.flats);
    const area = getElementsBy(parser.selectors.area);
    const deadLine = getElementsBy(parser.selectors.deadLine);
    const notes = getElementsBy(parser.selectors.other);
    
    while (id.length !== 0) {
        const home = {};
        home.id = id.shift();
        home.address = address.shift();
        home.floor = floor.shift();
        home.flats = flats.shift();
        home.area = area.shift();
        home.deadLine = deadLine.shift();
        home.notes = notes.shift();
        homes.push(home);
    }

    function getElementsBy(selector) {
        return $(selector).toArray().map(elem => $(elem).text().trim());
    }

    return homes;
}

async function getDOM() {
    try {
        const response = await axios.get(parser.url);
        logger.info(`Get response from ${parser.url}`)
        return response
    } catch (error) {
        logger.error(error);
    }
}