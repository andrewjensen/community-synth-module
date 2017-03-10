'use strict';

module.exports = class Synth {
  constructor(initialSteps) {
    this._initialSteps = initialSteps;
  }

  setup() {
    abstractMethod();
  }
}

function abstractMethod() {
  throw new Error('Abstract method!');
}
