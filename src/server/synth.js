'use strict';

const Particle = require('particle-api-js');

class Synth {
  constructor() {
    this.particle = new Particle();
    this.token = '';
    this.onConnectCallback = () => {};
  }

  login(username, password) {
    return this.particle.login({ username, password })
      .then(data => {
        console.log('Logged into Particle');
        this.token = data.body.access_token;
      })
      .then(() => {
        return this.particle.getEventStream({
          deviceId: 'mine',
          name: 'synth_connect',
          auth: this.token
        });
      })
      .then(eventStream => {
        eventStream.on('synth_connect', () => {
          console.log('Synth connecting...');
          this.onConnectCallback();
        });
      })
      .catch(err => {
        console.log('Could not log in.', err);
        return Promise.reject(err);
      });
  }

  onConnect(callback) {
    this.onConnectCallback = callback;
  }

  // SENDING DATA --------------------------------------------------------------

  initialize(steps) {
    return this.publish('initialize', steps.join(' '));
  }

  setStep(index, noteValue) {
    console.log(`Setting step ${index} to ${noteValue}`);

    const payload = `${index} ${noteValue}`;

    return this.publish('set_step', payload)
      .then(data => console.log('published:', data))
      .catch(err => console.error('Error publishing:', err));
  }

  publish(eventName, eventData) {
    return this.particle.publishEvent({
      name: eventName,
      data: eventData,
      auth: this.token
    });
  }
}

module.exports = Synth;
