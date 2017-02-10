'use strict';

class Store {
  constructor() {
    this.steps = [
      36,
      40,
      43,
      48,
      60,
      64,
      67,
      72,
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

  getDeviceCount() { return this.devices; }

  // ACTIONS -------------------------------------------------------------------

  incrementDevices() { this.devices++; }

  decrementDevices() { this.devices--; }

  setStep(index, value) {
    this.steps[index] = value;
  }
}

module.exports = Store;
