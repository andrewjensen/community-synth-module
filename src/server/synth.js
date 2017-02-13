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

  // TODO: change this interface
  setState(noteValue) {

    const synthState = (noteValue % 2 === 1 ? 'on' : 'off');
    console.log('sending state:', synthState);

    // TODO: actually send the step
    return this.publish('set_step', synthState)
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
