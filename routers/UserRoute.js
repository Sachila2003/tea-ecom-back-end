const express = require('express');
const router = express.Router();

const { 
    register, login, getProfile, updateProfile, changePassword,
    getAllUsers, updateUser, deleteUser 
} = require('../controllers/UserController');

const { auth, role } = require('../middleware/auth');
const upload = require('../middleware/upload');

// === Public Routes ===
router.post('/register', register);
router.post('/login', login);

// === Protected User Routes (for the logged-in user) ===
router.get('/profile', auth, getProfile);
router.put('/profile', auth, upload.single('profilePic'), updateProfile); 
router.put('/change-password', auth, changePassword);

// === Protected Admin-Only Routes ===
router.get('/', auth, role('admin'), getAllUsers);
router.put('/:id', auth, role('admin'), updateUser);
router.delete('/:id', auth, role('admin'), deleteUser);

module.exports = router;