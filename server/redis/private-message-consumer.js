const user = require('../models/user');
const privateMsg = require('../utils/redis-message');

const userInfo = new user();

module.exports = {
  /**
   * @function privateMessageConsumer()
   * function for send private messages to particular user
   */
  privateMessageConsumer: () => {
    console.log('consumer...')
    redis.psubscribe('private-*');
    // redis.psubscribe( "__keyspace@0__:*");


    /**
     * event listner for send private message to particular user
     */
    redis.on("pmessage", (pattern, channel, message) => {
      if (channel === 'private-messages') {
        // console.log(data);
        privateMsg.redisMessage('private-msg').then(res => {
          const result = JSON.parse(res);
          if (io.sockets.sockets[result.receiver] != undefined) {
            io.sockets.to(result.sender).emit('message', {
              sender: result.sender,
              sender_name: result.sender_name,
              message: result.message,
              time: result.time
            });
            io.sockets.to(result.receiver).emit('message', {
              sender: result.sender,
              sender_name: result.sender_name,
              message: result.message,
              time: result.time
            });
          }
        });
      }
    });
  }
}