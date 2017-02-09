'use strict';

const express = require('express');
const path = require('path');
const Store = require('./store');

const PUBLIC_DIR = path.resolve(__dirname, '../../public');
const CLIENT_SRC_DIR = path.resolve(__dirname, '../client');

module.exports = (port) => {

  const store = new Store();

  Promise.resolve()
    .then(() => startServer(port))
    .then(socketServer => handleSockets(socketServer, store));
};

function startServer(port) {
  return new Promise((resolve, reject) => {

    const app = express();
    const server = require('http').createServer(app);

    app.use(express.static(PUBLIC_DIR));
    app.use('/src', express.static(CLIENT_SRC_DIR));

    app.get('/', (req, res) => {
      res.sendFile(path.resolve(PUBLIC_DIR, 'index.html'));
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

function handleSockets(socketServer, store) {
  socketServer.on('connection', (socket) => {
    socket.on('client:initialize', () => {
      store.incrementDevices();
      socket.emit('server:initialize', store.getState());
      socketServer.emit('server:devices', store.getDeviceCount());
    });

    socket.on('disconnect', () => {
      store.decrementDevices();
      socketServer.emit('server:devices', store.getDeviceCount());
    });

    socket.on('client:step:set', (data) => {
      const step = data.step;
      const value = data.value;
      store.setStep(step, value);
      socketServer.emit('server:step:set', { step, value });
    });
  });
}
