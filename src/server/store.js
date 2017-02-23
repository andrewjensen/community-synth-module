'use strict';

const Music = require('../../lib/music');

class Store {
  constructor() {
    this.steps = [
      0,
      7,
      12,
      7,
      0,
      4,
      7,
      4,
    ];
    this.devices = 0;
    this.mode = 'Chromatic';
  }

  // ACCESSORS -----------------------------------------------------------------

  getState() {
    return {
      steps: this.steps,
      devices: this.devices,
      mode: this.mode,
    };
  }

  getSteps() { return this.steps; }

  getDeviceCount() { return this.devices; }

  // ACTIONS -------------------------------------------------------------------

  incrementDevices() { this.devices++; }

  decrementDevices() { this.devices--; }

  setStep(index, value) {
    this.steps[index] = value;
  }

  setMode(mode) {
    this.mode = mode;
    this.steps = this.steps.map(step => Music.snapToNearestAllowed(step, mode));
  }
}

module.exports = Store;
