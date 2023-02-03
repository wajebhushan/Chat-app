const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const schema = mongoose.Schema;

// schema for room users
const roomSchema = new schema({
  "socket_id": String,
  "username": {type:String, unique: true},
  "room": String,
});

module.exports.roomSchema = mongoose.model('user_room', roomSchema, 'user_room');

 // schema for rooms
const rooms = new schema({
  "room_name":String
});

module.exports.rooms = mongoose.model('rooms', rooms, 'rooms');

/**
 * schema for stored room messages
 */
const roomMessages = new schema({
  "socket_id": String,
  "room": String,
  "username":String,
  "messages": String,
  "time": Date
});

module.exports.roomMessages = mongoose.model('room_messages', roomMessages, 'room_messages');

/**
 * schema for store private messages
 */
const privateMessages = new schema({
  "sender": String,
  "sender_name":String,
  "receiver": String,
  "message": String,
  "time": Date
});

module.exports.privateMessages = mongoose.model('private_messages', privateMessages,'private_messages' )

// schema for user
const userSchema = new schema({
  "username":String,
  "email": {type:String, required:'Email is required'},
  "password": {type:String, required:'password is required'},
  "tokens": [{
    "token": {
      type: String
    },
  }],
  "token": String
});

/**
 * @function generateAuthToken - function for generate jwt token when user login
 */
userSchema.methods.generateAuthToken =  (user) => {
  const token = jwt.sign({ _id: user._id }, 'thisistoken');
  user.tokens = user.tokens.concat({ token });
  user.token = token;
  user.save();
  return token;
};


module.exports.userShcema = mongoose.model('user-details', userSchema, 'user-details')
