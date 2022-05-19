const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getMe,
  handleRefreshToken,
  handleLogout
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)
router.get('/refresh', handleRefreshToken)
router.get('/logout', handleLogout)

module.exports = router
