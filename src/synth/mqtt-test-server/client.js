var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
  client.subscribe('presence');
  client.subscribe('jamming');
  client.publish('presence', 'Hello mqtt')
});

client.on('message', (topic, message) => {
  // message is Buffer
  console.log(`Received message: ${message.toString()}`)
  // client.end()

  if (topic === 'jamming') {
    console.log('New number:', message.toString());
    client.publish('ack', 'thanks dude');
  }
});
