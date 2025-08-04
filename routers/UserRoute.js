const express = require('express');
const router = express.Router();

const { 
    register, 
    login, 
    getProfile,
    updateUser,
    deleteUser,
    getAllUsers 
} = require('../controllers/UserController');

const { auth, role } = require('../middleware/auth');


router.post('/register', register);
router.post('/login', login);


router.get('/profile', auth, getProfile);


router.get('/', auth, role('admin'), getAllUsers);

router.put('/:id', auth, updateUser);

router.delete('/:id', auth, deleteUser);

module.exports = router;