var express = require('express');
const getPublicReposNumber = require('../middleware/redisMiddleware');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    res.status(200).send("Key set successfully");
});

module.exports = router;
