'use strict';

const MidiKeyboard = require('./MidiKeyboard');

// const HOST = 'http://localhost:3000';
const HOST = 'http://community.andrewjensen.io';

const NOTE_LENGTH = 100;

// const COMMUNITY_MIDI_PORT = process.env.COMMUNITY_MIDI_PORT;
// const COMMUNITY_MIDI_PORT = 'IAC Driver IAC Bus 1';
const COMMUNITY_MIDI_PORT = 'USB Uno MIDI Interface';

let _index = -1;
let _steps = [
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
];
let _timer = null;
let _keyboard = new MidiKeyboard();

let ports = _keyboard.getPorts();
console.log('MIDI output ports:');
console.log(ports);
const portIndex = ports.get(COMMUNITY_MIDI_PORT);
_keyboard.connect(portIndex);

const socket = require('socket.io-client')(HOST);

socket.on('connect', () => {
  socket.emit('admin:initialize');
});

socket.on('disconnect', () => {
  console.log('disconnected!');
});

socket.on('server:initialize', (data) => {
  console.log('initialized!');
  setSteps(data.steps);
  startSequencer();
});

socket.on('server:step:set', (data) => {
  console.log('set step:', data);
  setStep(data.step, data.value);
});

socket.on('server:state', (data) => {
  setSteps(data.steps);
});

// -----

function startSequencer() {
  console.log('Starting sequencer.');
  _timer = setInterval(playNextNote, NOTE_LENGTH);
}

function playNextNote() {
  _index = ((_index + 1) % _steps.length);
  const value = _steps[_index];
  // console.log(`Note ${_index}: ${value}`);
  _keyboard.trigger(value);
}

function setSteps(steps) {
  console.log('setSteps:', steps);
  _steps = steps;
}

function setStep(step, value) {
  console.log('setStep', step, value);
  _steps = _steps.map((s, i) => {
    if (i === step) {
      return value;
    } else {
      return s;
    }
  });
  console.log('  results:', _steps);
}
