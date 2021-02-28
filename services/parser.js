'use strict';

const axios = require('axios');
const cheerio = require('cheerio');
const parser = require('../configs/parser.json');
const log4js_config = require('../configs/log4js.json')
const logger = require('log4js')
    .configure(log4js_config)
    .getLogger('parser');
const homes = [];

getData();

async function getData() {
    const response = await getDOM();
    const $ = cheerio.load(response.data);
    const id = getElementsBy(parser.selectors.id);
    logger.info(`Get ${id.length} homes from response`);
    const address = getElementsBy(parser.selectors.address);
    const floor = getElementsBy(parser.selectors.floor);
    const flats = getElementsBy(parser.selectors.flats);
    const area = getElementsBy(parser.selectors.area);
    const deadLine = getElementsBy(parser.selectors.deadLine);
    const other = getElementsBy(parser.selectors.other);
    
    while (id.length !== 0) {
        const home = {};
        home.id = id.shift();
        home.address = address.shift();
        home.floor = floor.shift();
        home.flats = flats.shift();
        home.area = area.shift();
        home.deadLine = deadLine.shift();
        home.other = other.shift();
        homes.push(home);
    }

    function getElementsBy(selector) {
        return $(selector).toArray().map(elem => $(elem).text().trim());
    }
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