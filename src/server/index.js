'use strict';

const express = require('express');
const path = require('path');
const Store = require('./store');
const Synth = require('./synth');

const PUBLIC_DIR = path.resolve(__dirname, '../../public');
const CLIENT_SRC_DIR = path.resolve(__dirname, '../client');
const LIB_DIR = path.resolve(__dirname, '../../lib');

if (!process.env.COMMUNITY_SYNTH_USERNAME || !process.env.COMMUNITY_SYNTH_PASSWORD) {
  throw new Error('Missing credentials for Particle!');
}
const username = process.env.COMMUNITY_SYNTH_USERNAME;
const password = process.env.COMMUNITY_SYNTH_PASSWORD;

module.exports = (port) => {

  const store = new Store();
  const synth = new Synth(store.getSteps());

  Promise.resolve()
    .then(() => synth.login(username, password))
    .then(() => startServer(port))
    .then(socketServer => handleSockets(socketServer, store, synth));
};

function startServer(port) {
  return new Promise((resolve, reject) => {

    const app = express();
    const server = require('http').createServer(app);

    app.use(express.static(PUBLIC_DIR));
    app.use('/src', express.static(CLIENT_SRC_DIR));
    app.use('/lib', express.static(LIB_DIR));

    app.get('/', (req, res) => {
      res.sendFile(path.resolve(PUBLIC_DIR, 'index.html'));
    });

    app.get('/ctrl', (req, res) => {
      res.sendFile(path.resolve(PUBLIC_DIR, 'admin.html'));
    });

    server.listen(port, (err) => {
      if (err) {
        console.error('Error starting server:', err);
        reject(err);
      }

      const socketServer = require('socket.io')(server);
      console.log(`Server listening on port ${port}`);
      resolve(socketServer);
    });
  });
}

function handleSockets(socketServer, store, synth) {
  const clientSockets = new WeakSet();

  socketServer.on('connection', (socket) => {
    socket.on('client:initialize', () => {
      clientSockets.add(socket);
      store.incrementDevices();
      socket.emit('server:initialize', store.getState());
      socketServer.emit('server:devices', store.getDeviceCount());
    });

    socket.on('admin:initialize', () => {
      socket.emit('server:initialize', store.getState());
    });

    socket.on('disconnect', () => {
      if (clientSockets.has(socket)) {
        store.decrementDevices();
      }
      socketServer.emit('server:devices', store.getDeviceCount());
    });

    socket.on('client:step:set', (data) => {
      const step = data.step;
      const value = data.value;
      console.log('[server] Received state change from client:', step, value);
      const wasPreviouslyModified = store.getIsModified();
      store.setStep(step, value);
      socketServer.emit('server:step:set', { step, value });
      if (!wasPreviouslyModified && !store.getIsWaiting()) {
        console.log('  Sending new state...');
        store.setIsModified(false);
        store.setIsWaiting(true);
        synth.sendSteps(store.getSteps());
      } else {
        console.log('  the store has been modified, so just wait for an ack.');
      }
    });

    socket.on('admin:mode:set', (data) => {
      const mode = data.mode;
      const wasPreviouslyModified = store.getIsModified();
      store.setMode(mode);
      socketServer.emit('server:state', store.getState());
      if (!wasPreviouslyModified && !store.getIsWaiting()) {
        store.setIsModified(false);
        store.setIsWaiting(true);
        synth.sendSteps(store.getSteps());
      }
    });
  });

  synth.onConnect(() => {
    console.log('[server] Handling synth connection...');
    store.setIsModified(false);
    store.setIsWaiting(true);
    synth.initialize(store.getSteps());
  });

  synth.onAck(() => {
    console.log('[server] ack.');
    store.setIsWaiting(false);
    if (store.getIsModified()) {
      console.log('  Sending new state...');
      store.setIsModified(false);
      store.setIsWaiting(true);
      synth.sendSteps(store.getSteps());
    }
    socketServer.emit('server:ack');
  });
}
