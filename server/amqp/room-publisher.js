const amqpConnection = require('./amqp-connection');


const connection = amqpConnection();

module.exports = {
  /**
   * @function roomPublisher()
   * Function for create room using amqp queue
   */
  roomPublisher: (room,message) => {
    connection.exchange('chat-exchange', { type: 'topic' }, (exchange) => {
      console.log('message publish....');
      exchange.publish('room.create', { room: room, message: message });
    });
  },

  /**
   * @function roomMessages()
   * Function for send message to particular room using amqp queue
   */
  roomMessages: (room,message) => {
    connection.exchange('chat-exchange', { type: 'topic' }, (exchange) => {
      console.log('message publish....');
      exchange.publish('room.messages', {room:room,message:message});
    });
  }
}

