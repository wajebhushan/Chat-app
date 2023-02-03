/**
 *
 * @param {*} username - username
 * @param {*} msg  - messages
 * @param {*} time - time
 * @function generateMessaage -: function for return message object
 */
const generateMessaage = (username, msg, time) => {
  return {
    username:username,
    message: msg,
    time: time
  }
}

module.exports = generateMessaage;