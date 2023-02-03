const amqpConnection = require('./amqp-connection');
const { getUser } = require('../utils/users');

const connection = amqpConnection();

module.exports = {
	/**
	 * @function messageQueue()
	 * function for bind queue to exchange and get data from message queue
	 */
	messageQueue: () => {
		connection.queue('messageQueue', { autoDelete: false }, (queue) => {
			queue.bind(exchange, 'message-key');
      queue.subscribe(function (message) {
        const sender = getUser(message.sender);
        const receiver = getUser(message.receiver);
        io.sockets.to(receiver[0].id).emit('message', { sender: sender[0].username, data: message.message, time: message.time });
			});
		});
	}
}