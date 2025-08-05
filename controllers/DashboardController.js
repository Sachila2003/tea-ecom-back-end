const User = require("../models/User");
const Product = require("../models/Product");

exports.getAdminDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        // const totalOrders = await Order.countDocuments();
        // const totalSalesData = await Order.aggregate([
        //     { $group: { _id: null, total: { $sum: '$totalPrice'}}}
        // ]);
        // const totalSales = totalSalesData.length > 0 ? totalSalesData[0].total : 0;

        const totalOrders = 452;
        const totalSales = 250000;

        res.status(200).json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalSales
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: "Error fetching dashboard stats from server." });
    }
}

exports.getSalesChartData = async (req, res) => {
    try {
        //order model hduwt psse pawichchi krn logic ek
        // const sevenDaysAgo = new DataTransfer();
        // sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // const salesData = await Order.aggregate([
        //     { $match: { createdAt: { $gte: sevenDaysAgo}, status: 'Delivered'}},
        //     {
        //         $group: {
        //             _id: { $dataToString: { format: '%Y-%m-%d' , date: '$createdAt' }},
        //             totalSales: { $sum: '$totalPrice' }
        //         }
        //     },
        //     { $sort: { _id: 1} }
        // ]);
        
        //sample data
        const salesData = [];
        const labels = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            // Labels for X-axis (e.g., "Jun 15")
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            
            // Random sales data for Y-axis
            salesData.push(Math.floor(Math.random() * (50000 - 10000 + 1)) + 10000);
        }
        
        res.status(200).json({
            labels: labels, // Array of strings (dates)
            data: salesData   // Array of numbers (sales)
        });

    } catch (error) {
        console.error("Error fetching sales chart data:", error);
        res.status(500).json({ error: 'Failed to fetch sales chart data' });
    }
};