'use strict';

const midi = require('midi');

module.exports = class MidiKeyboard {
  constructor() {
    this.output = new midi.output();
  }

  getPorts() {
    const ports = new Map();
    const count = this.output.getPortCount();
    for (let i = 0; i < count; i++) {
      const portIndex = i;
      const portName = this.output.getPortName(i);
      ports.set(portName, portIndex);
    }
    return ports;
  }

  connect(midiPort) {
    this.output.openPort(midiPort);
  }

  disconnect() {
    this.output.closePort();
  }

  trigger(pitch) {
    noteOn(this.output, pitch);
    setTimeout(() => {
      noteOff(this.output, pitch);
    }, 10);
  }
};

function noteOn(output, pitch) {
  output.sendMessage([144, pitch + 36, 127]); // note on
}

function noteOff(output, pitch) {
  output.sendMessage([128, pitch + 36, 127]); // note off
}
