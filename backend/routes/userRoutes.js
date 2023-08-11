const express = require('express')
const router = express.Router();
const {
  registerUser,
  getMe,
} = require('../controllers/userController')

const {handleLogin}  = require('../controllers/authController');
const {handleRefreshToken} = require('../controllers/refreshTokenController');
const {handleLogout} = require('../controllers/logoutController');
const { protect } = require('../middleware/authMiddleware')

router.post('/register', registerUser)
router.post('/login', handleLogin)

router.get('/me', protect, getMe)

router.get('/refresh', handleRefreshToken)
router.get('/logout', handleLogout)

module.exports = router
