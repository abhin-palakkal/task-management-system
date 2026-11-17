const express = require('express');
const {
  signup,
  login,
  checkRoleDemo,
} = require('../controllers/auth-controllers');
const checkToken = require('../middleware/checkToken');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/check', checkToken('USER'), checkRoleDemo);

module.exports = router;
