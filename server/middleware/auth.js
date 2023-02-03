const jwt = require('jsonwebtoken');
const userSchema = require('../models/schema');
const sendResponse = require('../response/send-response');
const schema = require('../models/schema');

/**
 * @param {*} req - request
 * @param {*} res - response
 * @param {*} next -next
 * @function auth - middleware for handle authentication and verify jwt token
 */
const auth = async (req, res, next) => {
 try {
  const header = req.headers.authorization;
   const token = header.replace('Bearer', '');
   const decode = jwt.verify(token, 'thisistoken');

   const user = await schema.userShcema.findOne({ '_id': decode._id, 'tokens.token': token });
  if (!user) {
   throw new Error();
  }
   req.token = token;
   req.user = user;
   req.userId = user._id

  next();
 } catch (e) {
   console.log(e);
  sendResponse(res, [], 'Authentication failed', true);
 }
};

module.exports = auth;


