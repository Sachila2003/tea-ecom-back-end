const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();

const UserRoute = require("./routers/UserRoute");

const app = express();

// Connect to MongoDB
connectDB();

//start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.use(express.json());

app.use("/api/users", UserRoute);


