const User = require('../models/user');
const sendResponse = require('../response/send-response');
const schema = require('../models/schema');


const userDetails = new User();

/**
 * @function getLoginDetails - function for get user login details
 */
exports.getLoginDetails = async (req, res,next) => {
  const userCredentials = {
    email: req.query.email,
    password: req.query.password
  };
      // generate jwt token
     userDetails.generateToken(userCredentials, (error,data, message, code) => {
        if (error) {
          sendResponse(data, [], message, true, code);
        }
       // get user details after generating token
       userDetails.getLoginDetails(data._id, userCredentials.password, (error, response, message, code) => {
        // console.log(response);
         if (error) {
           sendResponse(res, [], message, true, code);
         }
         sendResponse(res, response, message, false, code);
       });

      });
    }



/**
 * @function userRegistration -: function for register user details
 */
exports.userRegistration = (req, res, next) => {
  const userCredentials = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  };
  userDetails.setLoginDetails(userCredentials, (error,response,message,code) => {
    if (error) {
      sendResponse(res, [],message , true, code);
    }
    else {
      sendResponse(res, response, message, false,code);
    }
  });
}

/**
 *
 * @param {*} req - request
 * @param {*} res  - resonse
 * @param {*} next - next
 * @function getUserDetails -: Function for get user details
 */

exports.getUserDetails = (req, res, next) => {
  schema.userShcema.findOne({ "_id": req.userId }, (err, result) => {
    console.log(result);
    if (err) {
      sendResponse(res, [], 'Something went wrong', true, 500);
    }
    else {
      sendResponse(res, result, 'User fetch successfully', false, 200);
    }
  }).select({ _id: 1 }).lean();
}

/**
 *
 * @param {*} req - request
 * @param {*} res - response
 * @param {*} next - next
 * @function getAllUsers -: Function for get all users
 */

exports.getAllUsers = (req, res, next) => {
  schema.userShcema.find({}, (err, result) => {
   // console.log(result);
    if (err) {
      sendResponse(res, [], 'Something went wrong', true, 500);
    }
    else {
      sendResponse(res, result, 'User fetch successfully', false, 200);
    }
  }).select({ _id: 1, username: 1 }).lean();
}


/**
 * @function logoutUser - function for logout user from devices
 */
exports.logoutUser = async (req, res, next) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await req.user.save();
    sendResponse(res, [], 'Logout Successful', false, 200);
  }
  catch (e) {
    sendResponse(res, [], 'Logout Failed', true,500);
  }
};
