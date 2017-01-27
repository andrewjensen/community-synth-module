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

  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);

    // TODO: setup the socket server here too
    // const socketServer = require('./socketServer')(server)
  });
};
