'use strict';

const axios = require('axios');
const cheerio = require('cheerio');
const parser = require('../configs/parser.json');
const homes = [];

getData();

async function getData() {
    const response = await getDOM();
    const $ = cheerio.load(response.data);
    const id = getElementsBy(parser.selectors.id);
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
        return axios.get(parser.url);
    } catch (error) {
        console.error(error);
    }
}