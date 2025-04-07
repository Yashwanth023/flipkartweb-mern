
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Register a new user
router.post('/', userController.registerUser);

// Authenticate user & get token
router.post('/login', userController.loginUser);

// Get user profile
router.get('/profile', protect, userController.getUserProfile);

// Update user profile
router.put('/profile', protect, userController.updateUserProfile);

// Get all users - Admin only
router.get('/', protect, admin, userController.getUsers);

// Delete user - Admin only
router.delete('/:id', protect, admin, userController.deleteUser);

// Get user by ID - Admin only
router.get('/:id', protect, admin, userController.getUserById);

// Update user - Admin only
router.put('/:id', protect, admin, userController.updateUser);

module.exports = router;
