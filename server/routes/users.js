const express = require('express');
const validateUser = require('../middleware/auth');

const router = express.Router();

const user = require('../controllers/user-controller');

// default
router.get('/', (req, res, next) => {
  res.send('Users')
})
// Route for login user
router.get('/user-login', user.getLoginDetails);

// Route of user registration.
router.post('/user-register', user.userRegistration);

// Route for get user details
router.get('/get-user', validateUser, user.getUserDetails);

// Route for get all users
router.get('/all-users', user.getAllUsers);

// Route for logout user 
router.get('/user-logout', validateUser, user.logoutUser);

module.exports = router;
