const amqpConnection = require('./amqp-connection');
const { getUsersInRoom } = require('../utils/users');
const generateMessage = require('../utils/messages');

const connection = amqpConnection();

module.exports = {
	/**
	 * @function createQueue()
	 * function for bind queue to exchange and get data from message queue
	 */
	createRoomQueue: () => {

		connection.queue('createRoomQueue', { autoDelete: false }, (queue) => {
			queue.bind(exchange, '*.create');
			queue.subscribe(function (message) {
			//	console.log(io.sockets);
        //const rooms = io.sockets.adapter.rooms[message.room];
       // const room = Object.keys(rooms.sockets);
				//io.sockets.emit('message', generateMessage('Welcome!'));
				/* const user = getUsersInRoom(message.room);
				console.log(user); */
        io.sockets.to(message.room).emit('message',generateMessage(message.message));
				/* ar clients = Object.keys(io.sockets.connected); // connected clients
        for (let id of clients) {
          if (io.sockets.sockets[id] !== undefined) {  // if connected
            io.sockets.in(id).emit('message', sendMessage(message.message));
          } else {  //else not connected
						console.log('client not connected');
          }
        }*/
			});
		});
	}
}