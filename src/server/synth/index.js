// const LocalMidiSynth = require('./LocalMidiSynth');
const NetworkSynth = require('./NetworkSynth');

module.exports = {
  createLocalMidiSynth,
  createNetworkSynth,
};

function createLocalMidiSynth() {
  throw new Error('TODO: implement!');
}

function createNetworkSynth(initialSteps, username, password) {
  return new NetworkSynth(initialSteps, username, password);
}
