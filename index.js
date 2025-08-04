const express = require("express");
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const userRoute = require('./routers/UserRoute');
const productRoute = require('./routers/ProductRoute');

const app = express();

connectDB();

app.listen(
    process.env.SERVER_PORT, 
    () => console.log("Server started on port "+
        process.env.SERVER_PORT)
);

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/users', userRoute);
app.use('/api/products', productRoute);