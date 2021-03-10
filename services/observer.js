'use strict';
class EventObserver {
    constructor() {
        this.observers = [];
    }
  
    subscribe(object) {
        this.observers.push(object);
    }
  
    unsubscribe(id) {
        this.observers = this.observers.filter(subscriber => subscriber.id !== id);
    }
  
    broadcast() {
        this.observers.forEach(subscriber => subscriber.func(subscriber.id));
    }
  }

  module.exports = EventObserver;