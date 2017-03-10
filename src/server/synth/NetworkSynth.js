'use strict';

const Synth = require('./Synth');

const Particle = require('particle-api-js');

class NetworkSynth extends Synth {
  constructor(initialSteps, username, password) {
    super(initialSteps);
    this.username = username;
    this.password = password;
    this.particle = new Particle();
    this.token = '';
    this.onConnectCallback = () => {};
  }

  setup() {
    return this.particle.login({
      username: this.username,
      password: this.password,
    })
      .then(data => {
        console.log('Logged into Particle');
        this.token = data.body.access_token;
      })
      .then(() => {
        return this.particle.getEventStream({
          deviceId: 'mine',
          auth: this.token
        });
      })
      .then(eventStream => {
        eventStream.on('synth_connect', () => {
          console.log('[synth]  Connecting...');
          this.onConnectCallback();
          this.modified = false;
        });
        eventStream.on('synth_ack', () => {
          this.onAckCallback();
        });
      })
      .catch(err => {
        console.log('Could not log in.', err);
        return Promise.reject(err);
      });
  }

  onConnect(callback) {
    console.log('[synth] Handling synth connection...');
    // store.setIsModified(false);
    // store.setIsWaiting(true);
    // synth.initialize(store.getSteps());
  }

  onAck(callback) {
    this.onAckCallback = callback;
  }

  initialize(steps) {
    console.log('[synth]  Initializing...');
    return _initialize(steps, this.particle, this.token);
  }

  sendSteps(steps) {
    console.log('[synth]  Sending steps...');
    return _sendSteps(steps, this.particle, this.token);
  }
}

// SENDING DATA ----------------------------------------------------------------

function _initialize(steps, particle, token) {
  return _publish('initialize', steps.join(' '), particle, token)
    .then(data => console.log('  sent initialization:', data))
    .catch(err => console.error('Error publishing:', err));
}

function _sendSteps(steps, particle, token) {
  return _publish('set_steps', steps.join(' '), particle, token)
    .then(data => console.log('  sent steps:', data))
    .catch(err => console.error('Error publishing:', err));
}

function _publish(eventName, eventData, particle, token) {
  return particle.publishEvent({
    name: eventName,
    data: eventData,
    auth: token
  });
}

module.exports = NetworkSynth;
