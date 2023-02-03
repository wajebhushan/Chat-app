const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
const cors = require('cors');
const socket = require('./socket');
const redisClient = require('redis');
const fetch = require('node-fetch');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const chatRoom = require('./routes/chatRoom');
/* const amqpConnection = require('./amqp/amqp-connection');
const roomConsumer = require('./amqp/room-consumer');
const roomMsgConsumer = require('./amqp/room-messages');
const messageQueue = require('./amqp/message-consumer'); */
const mongoose = require('./mongoose/dbConnection');
const room_consumer = require('./redis/room-consumer');
const private_message_consumer = require('./redis/private-message-consumer');

const app = express();


const server = http.createServer(app); // create http server
//const connection = amqpConnection();


// socket connection
io = module.exports = require('socket.io')(server);// initialize socket
redis = module.exports = redisClient.createClient();
new mongoose().connect().then(res => {
 socket.initSocket();
}).catch(err => {
  console.log('Error to connect mongoose')
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/chat-room', chatRoom);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// redis consumers
room_consumer.roomConsumer();
private_message_consumer.privateMessageConsumer();
//room_message_consumer.roomMessageConsumer();

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);




/*
  // socket.io connection

io.sockets.on('connection', (socket) => {
    console.log('socket connectio')
    socket.on('private-msg', (message) => {
      publish.publisher(message);
    });
  }); */

/**
 * rabbitmq connection
 */
/* connection.on('ready', function () {
  console.log('rabbit connection')

  exchange = module.exports = connection.exchange('chat-exchange', { type: 'topic' });
  roomConsumer.createRoomQueue();
  roomMsgConsumer.createRoomMesagesQueue();
  messageQueue.messageQueue();
}) */


/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  console.log('Listening on ' + bind);
}