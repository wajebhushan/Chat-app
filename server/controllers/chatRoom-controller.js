const sendResponse = require('../response/send-response');
const schema = require('../models/schema');

/**
 *
 * @param {*} req - request
 * @param {*} res - response
 * @param {*} next - next
 * @function createRoom -: function for create new room
 */
exports.createRoom = (req, res, next) => {
  const newRoom = req.body.room

  const rooms = new schema.rooms({
    'room_name': newRoom
  });
  rooms.save((err, doc) => {
    if (err) {
      sendResponse(res, [], 'Something went wrong', true, 500);
    }
    sendResponse(res, [], 'Operation successful', false, 200);
  });
}

/**
 *
 * @param {*} req - request
 * @param {*} res - response
 * @param {*} next - next
 * @function getAllChatRooms -:Function for get all chat rooms
 */
exports.getAllChatRooms = (req, res, next) => {
  schema.rooms.find({}, (error, result) => {
    if (error) {
      sendResponse(res, [], 'Something went wrong', true, 500);
    }
    sendResponse(res, result, 'Operation successful', false, 200);
  }).lean();
}