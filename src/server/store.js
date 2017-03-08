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
    this.isModified = false;
    this.isWaiting = false;
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

  getIsModified() { return this.isModified; }

  getIsWaiting() { return this.isWaiting; }

  // ACTIONS -------------------------------------------------------------------

  incrementDevices() { this.devices++; }

  decrementDevices() { this.devices--; }

  setStep(index, value) {
    this.steps[index] = value;
    this.setIsModified(true);
  }

  setMode(mode) {
    this.mode = mode;
    this.steps = this.steps.map(step => Music.snapToNearestAllowed(step, mode));
    this.setIsModified(true);
  }

  setIsModified(isModified) {
    console.log('  setIsModified', isModified);
    this.isModified = isModified;
  }

  setIsWaiting(isWaiting) {
    console.log('  setIsWaiting', isWaiting);
    this.isWaiting = isWaiting;
  }
}

module.exports = Store;
