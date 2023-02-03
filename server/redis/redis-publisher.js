const redisClient = require('redis');

const redis = redisClient.createClient();

module.exports = {
  // Function publish room creation messsage to other room members
  createRoom: (room, message) => {
    console.log('publish.....')
    const time = new Date();
    redis.publish("room-create", JSON.stringify({room, message, time }));
  },
  // Function for publish message in particular room
  roomMessages: () => {
    console.log('publish room message....')
    redis.publish("room-messages",JSON.stringify('room messages'))
  },
  // Function for publish private message to particular user
  privateMessage: () => {
    redis.publish("private-messages", 'private messages');
  }


}