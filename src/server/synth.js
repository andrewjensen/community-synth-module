'use strict';

const Particle = require('particle-api-js');

class Synth {
  constructor() {
    this.particle = new Particle();
    this.token = '';
  }

  login(username, password) {
    return this.particle.login({ username, password })
      .then(data => {
        console.log('Logged into Particle');
        this.token = data.body.access_token;
      })
      .catch(err => {
        console.log('Could not log in.', err);
        return Promise.reject(err);
      });
  }

  // TODO: change this interface
  setState(noteValue) {

    const synthState = (noteValue % 2 === 1 ? 'on' : 'off');
    console.log('sending state:', synthState);

    // TODO: actually send the step
    return this.particle.publishEvent({
      name: 'set_state',
      data: synthState,
      auth: this.token
    })
      .then(data => console.log('published:', data))
      .catch(err => console.error('Error publishing:', err));
  }
}

module.exports = Synth;
