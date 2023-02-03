const fetch = require('node-fetch');
const redis = require('redis');

const redisClient = redis.createClient();
redisClient.config("SET", "notify-keyspace-events", "KEA",()=>{});
async function getPublicReposNumber(req, res, next) {
  //console.log(req);
  try {
    redisClient.set('user-details', 'namdev' , (err, reply) => {
      redisClient.set('user-details', 'another-key', (err, reply) => {
        redisClient.del('user-details', (err) => {
          redisClient.setex('another-key', 30, 'hello, i am namdev jagtap', () => {
            redisClient.mset('another-key1', 'some values', 'another-key2', 'some values');
         })
       })
      })
    });
  }
  catch (error) {
    console.log(error);
   // res.status(500).json({ error: error });
  }
  next();
}

module.exports = getPublicReposNumber;