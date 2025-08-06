const Product = require('../models/Product');

// --- Create a new Product ---
const createProduct = async (req, res) => {
    try {
        const { title, description, price, stock, category } = req.body; 
        if (!title || !description || !price) {
            return res.status(400).json({ msg: "Title, description, and price are required." });
        }
        if (!req.file) {
            return res.status(400).json({ msg: "Product image is required." });
        }
        const imageUrl = req.file.path.replace(/\\/g, "/");
        const newProduct = new Product({
            title, description, price, imageUrl,
            stock: stock || 0,
            category: category || 'Uncategorized',
            seller: req.user.id
        });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ msg: "Server error occurred.", error: error.message });
    }
};

// --- Get all Products (Public, Approved Only) ---
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ status: 'approved' }).populate('seller', 'name');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ msg: "Error fetching products." });
    }
};

// --- Get all Products (Admin-Only) ---
const getAllProductsForAdmin = async (req, res) => {
    try {
        const products = await Product.find({}).populate('seller', 'name');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ msg: 'Failed to fetch products for admin' });
    }
};

// --- Update a Product (Admin Only) ---
const updateProduct = async (req, res) => {
    try {
        const { title, description, price, status, stock, category } = req.body;

        const updateFields = {};
        if (title) updateFields.title = title;
        if (description) updateFields.description = description;
        if (price !== undefined) updateFields.price = price;
        if (status) updateFields.status = status;
        if (stock !== undefined) updateFields.stock = stock;
        if (category !== undefined) updateFields.category = category;

        if (req.file) {
            updateFields.imageUrl = req.file.path.replace(/\\/g, "/");
        }
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        res.status(200).json(updatedProduct);

    } catch (error) {
        console.error("DETAILED UPDATE ERROR:", error); 
        res.status(500).json({ msg: 'Server error while updating product.' });
    }
};

// --- Delete a Product (Admin Only) ---
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.status(200).json({ msg: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'Failed to delete product' });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getAllProductsForAdmin,
    updateProduct,
    deleteProduct
};