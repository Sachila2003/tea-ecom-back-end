const Product = require("../models/Product");

const createProduct = async (req, res) => {
    try {
        const { title, description, price } = req.body;
        if (!title || !description || !price) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }
        if (!req.file) {
            return res.status(400).json({ message: "Product image is required." });
        }
        const imageUrl = req.file.path.replace(/\\/g, "/");
        
        const newProduct = new Product({
            title,
            description,
            price,
            imageUrl
        });

        const savedProduct = await newProduct.save();
        res.status(201).json({ message: "Product added successfully!", product: savedProduct });

    } catch (error) {
        console.error("Server Error in createProduct:", error);
        res.status(500).json({ message: "Server error occurred.", error: error.message });
    }
};

const getAllproducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error("Server Error in getAllproducts:", error);
        res.status(500).json({ message: "Server error occurred.", error: error.message });
    }
}

module.exports = {
    createProduct,
    getAllproducts
};