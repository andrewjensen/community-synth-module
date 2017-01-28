'use strict';

const express = require('express');
const path = require('path');

const PUBLIC_DIR = path.resolve(__dirname, '../../public');
const CLIENT_SRC_DIR = path.resolve(__dirname, '../client');

module.exports = (port) => {

  const app = express();
  const server = require('http').createServer(app);

  app.use(express.static(PUBLIC_DIR));
  app.use('/src', express.static(CLIENT_SRC_DIR));

  app.get('/', (req, res) => {
    res.sendFile(path.resolve(PUBLIC_DIR, 'index.html'));
  });

  let _steps = [
    36,
    40,
    43,
    48,
    60,
    64,
    67,
    72,
  ];

  function getState() {
    return {
      steps: _steps
    };
  }

  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);

    const io = require('socket.io')(server);

    io.on('connection', (socket) => {
      console.log('got a connection!');

      socket.on('client:initialize', () => {
        socket.emit('server:initialize', getState());
      });

      socket.on('client:step:set', (data) => {
        const step = data.step;
        const value = data.value;
        _steps[step] = value;
        io.emit('server:step:set', { step, value });
      });
    });
  });
};
