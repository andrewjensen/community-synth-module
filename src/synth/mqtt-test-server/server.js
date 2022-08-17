// https://docs.particle.io/guide/tools-and-features/cli/photon/#using-libraries

var mosca = require('mosca');

var settings = {
  port: 1883
};

var server = new mosca.Server(settings);

server.on('clientConnected', (client) => {
  console.log('client connected', client.id);

  startRandomMessages();
});

server.on('clientDisconnected', () => {
  console.log('Client Disconnected.');
  stopRandomMessages();
});

server.on('published', (packet, client) => {
  if (client) {
    console.log('Client:', packet.payload.toString());
  } else {
    console.log('Server:', packet.payload);
    // console.log('\tthis came from the server.');
  }
});

server.on('delivered', (packet, client) => {
  console.log('Received from client:', packet);
});

server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running');
}

var sendingMessages = false;

function startRandomMessages() {
  sendingMessages = true;
  nextRandomMessage();
}

function stopRandomMessages() {
  sendingMessages = false;
}

function nextRandomMessage() {
  if (!sendingMessages) return;

  const number = Math.floor(Math.random() * 100);
  const waitTime = Math.floor(Math.random() * 500) + 500;
  var response = {
    topic: 'jamming',
    payload: `${number}`,
    qos: 1,
    retain: false
  };
  server.publish(response);

  setTimeout(nextRandomMessage, waitTime);
}
