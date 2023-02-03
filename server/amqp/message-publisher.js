const amqpConnection = require('./amqp-connection');


const connection = amqpConnection();

module.exports = {
  /**
   * @function messagePublisher()
   * Function for publish data to rabbitmq message queue
   */
   messagePublisher: (sender,receiver, message) => {
    connection.exchange('chat-exchange', { type: 'topic' }, (exchange) => {
      console.log('message publish....');
      exchange.publish('message-key', {sender:sender, receiver: receiver, message: message, time:new Date() });
    });
  },
}