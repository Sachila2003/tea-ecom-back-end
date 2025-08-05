const express = require('express');
const router = express.Router();

const { getAdminDashboardStats } = require('../controllers/DashboardController'); 
const { auth, role } = require('../middleware/auth');

router.get('/stats', auth, role('admin'), getAdminDashboardStats);

module.exports = router;