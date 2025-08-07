const express = require('express');
const router = express.Router();

const { getSettings, updateSettings } = require('../controllers/settingController');
const { auth, role } = require('../middleware/auth');

router.get('/', auth, role('admin'), getSettings);
router.put('/', auth, role('admin'), updateSettings);

module.exports = router;