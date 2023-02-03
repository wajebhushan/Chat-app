/**
 * @function sendResponse() - function for send response to client
 * @param {*} res - response object
 * @param {*} data - data to be send to client
 * @param {*} msg - message
 * @param {*} error - error
 * @param {*} code - error code
 */

function sendResponse(res, data, msg, error, code) {
  let response = {
    code: 200,
    msg: '',
    result: data,
  };
  response.msg = msg;
  if (error) {
    response.code = code;
  }
  res.setHeader('Content-Type', 'text/plain');
  res.status(response.code).send(response);
}

module.exports = sendResponse;