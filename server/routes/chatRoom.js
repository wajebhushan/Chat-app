const express = require('express');

const chatRoomController = require('../controllers/chatRoom-controller');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('room');
});

// Route for create room 
router.post('/create-room', chatRoomController.createRoom);

// Route for get all rooms
router.get('/all-rooms',chatRoomController.getAllChatRooms)

module.exports = router;
