'use strict';

const { log4js } = require('../utils/log4js');
const logger = log4js.getLogger('observer');

class EventObserver {
    constructor () {
        this.observers = [];
    }
  
    subscribe (fn) {
        logger.info(fn);
        this.observers.push(fn);
    }
  
    unsubscribe (fn) {
        this.observers = this.observers.filter(subscriber => subscriber === fn);
        logger.info(this.observers.length);
    }
  
    broadcast () {
        this.observers.forEach(subscriber => subscriber());
    }
  }

  module.exports = EventObserver;