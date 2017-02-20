'use strict';

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
  }

  // ACCESSORS -----------------------------------------------------------------

  getState() {
    return {
      steps: this.steps,
      devices: this.devices
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
}

module.exports = Store;
