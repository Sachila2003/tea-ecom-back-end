const express = require('express');
const router = express.Router();

const { getAdminDashboardStats, getSalesChartData } = require('../controllers/DashboardController'); 
const { auth, role } = require('../middleware/auth');

router.get('/stats', auth, role('admin'), getAdminDashboardStats);
router.get('/sales-chart', auth, role('admin'), getSalesChartData);

module.exports = router;