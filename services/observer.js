'use strict';

const { log4js } = require('../utils/log4js');
const logger = log4js.getLogger('observers');

class EventObserver {
    constructor() {
        this.observers = [];
    }
  
    subscribe(object) {
        this.observers.push(object);
    }
  
    unsubscribe(id) {
        this.observers = this.observers.filter(subscriber => subscriber.user.id !== id);
        logger.info(this.observers.length);
    }
  
    broadcast() {
        this.observers.forEach(subscriber => subscriber.func(subscriber.user, subscriber.ctx));
    }
  }

  module.exports = EventObserver;