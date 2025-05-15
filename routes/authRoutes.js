const express = require('express');
const router = express.Router();
const { registerUser, loginUser, googleCallback,updateUserData,getUserData} = require('../controllers/authController');
const { check } = require('express-validator');
const passport = require('passport');
const auth = require('../middleware/auth');
// Register user
router.post(
  '/register',
  [
    check('fullName', 'Full name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
  ],
  registerUser
);

// Login user
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  loginUser
);
router.put('/update', auth,updateUserData);
router.get('/me', auth, getUserData);
// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), googleCallback);

module.exports = router;