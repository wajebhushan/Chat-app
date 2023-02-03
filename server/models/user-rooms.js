const redisClient = require('redis');

const schema = require('./schema');


const redis = redisClient.createClient();

class UserRoom {

  constructor() { }

   /**
    *
    * @param {*} - socket_id,username, room
    * @function addUserRoom():-
    * Function for add user details in database
    *
    */
   addUserRoom = ({ socket_id, username, room }) => {
   new schema.roomSchema({
      "socket_id": socket_id,
      "username": username,
      "room": room,
   }).save((err, result) => {
     // console.log(result);
      this.getRoomUsers(result.room).then(res => {
         redis.set(result.room, JSON.stringify(res),()=>{});
      });
   });
    // return roomUser;
  }

   /**
    *
    * @param {*} room
    * @function getRoomUsers():-
    * Function for get users in particular room
    */

  getRoomUsers = (room) => {
   // console.log(room);
     const roomUsers = schema.roomSchema.find({ "room": room }).lean();
    return roomUsers;
}

   /**
    *
    * @param {*} socket_id
    * @function reomoveRoomUsers():-
    * Function for remove users in particular room
    */

   removeRoomUsers = ({socket_id}) => {
      const removedUser = schema.roomSchema.findOneAndRemove({ "socket_id": socket_id }, (err, result) => {
         if (result) {
            this.getRoomUsers(result.room).then(res => {
               redis.set(result.room, JSON.stringify(res),()=>{});
            });
         }
      }).lean();
      return removedUser;
   }

   /**
    *
    * @param {*} username - user name
    * @param {*} cb   - callback function
    * @function existsUser():-
    * Function for check if particular user name exists or not in room
    *
    */

   existsUser = (socketId, cb) => {
     // console.time('default-query');
      schema.roomSchema.find({ "socket_id": socketId }, (err, docs) => {
         if (docs.length) {
            cb('Username exists already', true);
         } else {
            //  console.log(docs);
            cb(null, false)
         }
      });
      // console.timeEnd('default-query');
   }

   /**
    *
    * @param {*} socket_id - socket id
    * @param {*} cb - callback function
    * @function getUserRoom():-
    * Function for get room name of particular user
    */

   getUserRoom = (socket_id, cb) => {
      schema.roomSchema.find({ "socket_id": socket_id }, (error, result) => {
         if (error) {
            cb('No room found', true);
         }
         cb(result, false);
      });
     // console.log(sizeof(data));
   }

   storedRoomMessages = (socketId, roomId,username, message) => {
      const messages = new schema.roomMessages({
         "socket_id": socketId,
         "room": roomId,
         "username": username,
         "messages": message,
         "time": new Date()
      });
      return messages;
   }

   /**
    *
    * @param {*} room room name
    * @function redisRoom()
    * Function for get data from redis cache
    */
   redisRoom = (room) => {
      console.log('ROOM:' + room);
      return new Promise((resolve, reject) => {
         redis.get(room, (err, reply) => {
           // console.log(reply);
            if (err) {
               reject(err);
            } else if (reply) {
               resolve(reply);
            } else {
               this.getRoomUsers(room).then(result => {
                 // console.log(room);
                  redis.set(room, JSON.stringify(result), () => { });
               }).catch(error => {
                  reject(error);
               });
            }
         });
      });
   }

}

module.exports = UserRoom;