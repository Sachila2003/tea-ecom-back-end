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