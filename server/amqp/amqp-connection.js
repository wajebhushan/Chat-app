const amqp = require('amqp');
/**
 * Rabbitmq connection
 */
const amqpConnection = () => {
  const connection = amqp.createConnection({
    host: 'localhost',
    login: 'namdev',
    password: 'namdev123',
    vhost: '/'
  });

  return connection;
};

module.exports = amqpConnection;