const room = require('../models/user-rooms');
const generateMessaage = require("../utils/messages");
const roomMessages = require('../utils/redis-message');

const roomUsers = new room();

module.exports = {
  roomConsumer: () => {
    console.log('consumer...')
  //  redis.psubscribe("user.*");
    redis.subscribe("room-create");
    redis.subscribe('room-messages');
   // redis.subscribe( "__keyspace@0__:user-details");
/**
 * Event listner for create room and send messages between room's
 */
    redis.on("message", (channel, message) => {

      const data = JSON.parse(message);
     // console.log(data);
      switch (channel) {
        case 'room-create':
         // io.to(data.room).emit('message', generateMessaage(null, data.message));
           roomUsers.redisRoom(data.room).then(response => {
             const result = JSON.parse(response);
            // console.log(result);
             for (let res of result) {
               //console.log(res);
               if (io.sockets.sockets[res.socket_id] != undefined) {
                 // console.log("hello");
                io.sockets.to(res.socket_id).emit('message', generateMessaage(null, data.message, data.time));
              }
            }
          });
          break;
        case 'room-messages':
          roomMessages.redisMessage('room-messages').then(res => {
            const result = JSON.parse(res);
            io.sockets.in(result.room).emit('message', generateMessaage(result.username, result.messages, result.time));
          });
          break;
        default:
          console.log('Channel not match')
         }
    });
  }
}

