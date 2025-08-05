const express = require("express");
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const userRoute = require('./routers/UserRoute');
const productRoute = require('./routers/ProductRoute');
const dashboardRoute = require('./routers/DashboardRoute');

const app = express();
connectDB();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/dashboard', dashboardRoute);

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});