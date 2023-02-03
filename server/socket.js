const jwt = require('jsonwebtoken');
const redisClient = require('redis');

const generateMessage = require('./utils/messages');
const publisher = require('./redis/redis-publisher');
const room = require('./models/user-rooms');
const user = require('./models/user');

const roomUser = new room();
const userInfo = new user();
const redis = redisClient.createClient();
module.exports = {
  
  initSocket: () => {

    // Authenticate jwt token for socket
    io.use(function (socket, next) {
      if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(socket.handshake.query.token, 'thisistoken', function (err, decoded) {
          if (err) return next(new Error('Authentication error'));
          socket.id = decoded._id;
          next();
        });
      }
      else {
        next(new Error('Authentication error'));
      }
    });


    // Socket connection
    io.sockets.on('connection', (socket) => {
      console.log("SocketID is:"+socket.id);
      socket.emit('message', generateMessage(socket.username, 'Welcome, You are connected', new Date()));

      /**
       * Join event for room chatting
       */
      socket.on('join', (chatRoomId) => {

        socket.join(chatRoomId);

        userInfo.getUser(socket.id).then(res => {

          roomUser.existsUser(socket.id, (message, error) => {
            if (error) {

             publisher.createRoom(socket.id, chatRoomId, `${res.username} has join the room`);
            } else {

              roomUser.addUserRoom({ socket_id: socket.id, username: res.username, room: chatRoomId });
               socket.username = res.username;
              socket.emit('message', generateMessage('Welcome!'));

              //publish message via redis publisher
              publisher.createRoom(chatRoomId, `${res.username} has join the room`);
            }
           })
        });
      });


    // Event for leave particular room
      socket.on('leave', () => {

      // remove user from database and from redis cache when user leave the room
        roomUser.removeRoomUsers({
          socket_id: socket.id
        }).then(result => {
          if (result) {
            socket.leave(result.socket_id)
            setRoomUsers.roomUsers(result.room);
            socket.to(result.room).emit('message', generateMessage(socket.username,`${result.username} has left`))
          }
        });
      });


      // Event for send message in room
      socket.on('sendMessage', (data) => {

        roomUser.storedRoomMessages(socket.id, data.roomId, socket.username, data.message).save((error, result) => {
          redis.set('room-messages', JSON.stringify(result), () => { });
          publisher.roomMessages();
        });
      });


      // Event for private messages
      socket.on('private-msg', (data) => {
        userInfo.getUser(socket.id).then(async result => {
         userInfo.storedPrivateMessages(socket.id, data.receiver, result.username, data.message).save((error, result) => {
           redis.set('private-msg', JSON.stringify(result), () => { });
           publisher.privateMessage();
        });
        });
      });


       // Event for disconnect or leave room
      socket.on('disconnect', () => {

        // remove user details from database and redis cache when user disconnect the connection
        roomUser.removeRoomUsers({
          socket_id: socket.id
        }).then(result => {
          if (result) {
            socket.leave(result.socket_id);
            socket.broadcast.to(result.room).emit('message', generateMessage(`${result.username} has left`));
          }
        });
        // remove particular user from database when
        userInfo.removedUser(socket.id);
      });
    });

  }
}
