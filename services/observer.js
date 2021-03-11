'use strict';
class EventObserver {
    constructor(func) {
        this.observers = [];
        this.func = func;
    }
  
    subscribe(id) {
        this.observers.push(id);
    }
  
    unsubscribe(id) {
        this.observers = this.observers.filter(subscriber => subscriber !== id);
    }
  
    broadcast() {
        this.observers.forEach(subscriber => this.func(subscriber));
    }
  }

  module.exports = EventObserver;