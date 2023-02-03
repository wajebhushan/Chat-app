const bcrypt = require('bcrypt');
const schema = require('./schema');



class User {

  constructor() { }

  /**
   * @param {*} socket_id socket id
   * @param {*} username username
   * @function addUser()
   * Function for add user into db
   */
  addUser = ({ socket_id, username }) => {
    new schema.userShcema({
      "socket_id": socket_id,
      "username": username
    }).save((err, res) => { });
  }

  /**
   * @param {*} username - user name
   * @param {*} cb   - callback function
   * @function existsUser():-
   * Function for check if particular user name exists or not in db
   */
  existsUser = (username, cb) => {
    schema.userShcema.find({ "username": username }, (err, docs) => {
      if (docs.length) {
        cb('Username exists already', true);
      } else {
        //console.log(docs);
        cb(null, false)
      }
    });
  }

  /**
   * @param {*} username username
   * @function getUser()
   * Function for get user from db
   */
  getUser = (userId) => {
    const user = schema.userShcema.findOne({ "_id": userId }).select({_id:0, username:1});
    return user;
  }

  /**
   * @param {*} socket_id socket id
   * @function removedUser()
   * Function for remove user from db
   */
  removedUser = (socket_id) => {
    schema.userShcema.findOneAndRemove({ "socket_id": socket_id }).lean();
  }
/**
 *
 * @param {*} socketId
 * @function getUserById()
 */
/*   getUserById = (socketId) => {
    const user = schema.userShcema.findOne({ "_id": socketId }).select({username:1}).lean();
    return user;
  }
 */
  storedPrivateMessages = (sender, receiver, username, message) => {
    console.log(username);
    const user = new schema.privateMessages({
      "sender": sender,
      "sender_name": username,
      "receiver": receiver,
      "message": message,
      "time": new Date()
    });
    return user;
  }

/**
 * @function getLoginDetails - function for get login details of users
 * @param {*} callback - callback function for return result or error
 */

  getLoginDetails(userId, password, callback) {
   // const email = userCredentials.email;
   // const password = userCredentials.password;
    schema.userShcema.findOne({ '_id': userId }, function (error, data) {
     // console.log(data);
    if (error) {
      return callback(true, [], "Something went wrong", 500);
    } else if (data === null) {
      return callback(true, [], "No User Found", 412);
    } else {
      bcrypt.compare(password, data.password,).then(doCheck => {
        console.log(doCheck);
        if (doCheck) {
          return callback(false, data, "Login Successfull", 200);
        }
        return callback(true, [], "Password Not Match", 401);
      }).catch(error => {
       // console.log(error);
        return callback(true, [], "Something Went wrong", 401);
      });
    }
  }).select({_id:1, username:1,token:1, email:1, password:1});
}

  /**
   *
   * @param {*} credentials
   * @param {*} callback
   * @function generateToken()
   * Function for generate token
   */

generateToken(credentials, callback) {
const users = new schema.userShcema();
 const email = credentials.email;
  console.time("default-query");
  schema.userShcema.findOne({ 'email': email }, async function (error, data) {
    if (error) {
      return callback(true,[], "Something went wrong", 500);
    }
    else if (data === null) {
      return callback(true,[], "No User Found", 412);
    }
    await users.generateAuthToken(data);
    return callback(false,data._id, "Token Generate Successfully", 200);
  }).select({ _id: 1, token: 1, tokens: 1 });
  console.timeEnd("default-query");
  }


  /**
   * @function setLoginDetails - function for register new user in database
   * @param {*} userDetails - get user details from client
   * @param {*} callback - callback function
   */

  setLoginDetails(userDetails, callback) {
    schema.userShcema.findOne({ 'email': userDetails.email }, (error, result) => {
      if (result) {
        return callback(true, null, 'email already exists', 422);
      }
       bcrypt.hash(userDetails.password, 12).then(hashPassword => {
        const users = new schema.userShcema({
          username: userDetails.username,
          email: userDetails.email,
          password: hashPassword
        });
        users.save((err, result) => {
          if (err) {
            return callback(err, null, "Something went wrong", 500);
          }
          return callback(null, result, "save details successfully", 200);
        });
      });
    });
  }
}

module.exports = User;