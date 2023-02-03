const redisClient = require('redis');

const redis = redisClient.createClient();

/**
 * @function redisMessage -: function for get messages from redis
 */
module.exports = {
  redisMessage: (id) => {
    return new Promise((resolve, reject) => {
       redis.get(id, (err, reply) => {
         // console.log(reply);
          if (err) {
             reject(err);
          } else if (reply) {
             resolve(reply);
          }
       });
    });
  }
}