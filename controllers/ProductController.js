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

//get products for logged seller
const getSellerProducts = async (req, res) => {
    try {
        const products = await Product.find({ seller: req.user.id});
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching seller products:", error);
        res.status(500).json({ error: 'Failed tp fetch your products'});
    }
};

//update product by seller
const updateMyProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        
        // Check if the product belongs to the logged-in seller
        if (product.seller.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to update this product' });
        }

        // Update fields sent from the frontend
        const { title, description, price, stock, category } = req.body;
        product.title = title || product.title;
        product.description = description || product.description;
        product.price = price !== undefined ? price : product.price;
        product.stock = stock !== undefined ? stock : product.stock;
        product.category = category || product.category;

        // Handle image update
        if (req.file) {
            product.imageUrl = req.file.path.replace(/\\/g, "/");
        }

        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);

    } catch (error) {
        console.error("Update My Product Error:", error);
        res.status(500).json({ msg: 'Server error while updating product' });
    }
};

//delete product by seller
const deleteMyProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        
        if (product.seller.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to delete this product' });
        }
        
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ msg: 'Product removed' });
    } catch (error) {
        console.error("Delete My Product Error:", error);
        res.status(500).json({ msg: 'Server error while deleting product' });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getAllProductsForAdmin,
    updateProduct,
    deleteProduct,
    getSellerProducts,
    updateMyProduct,
    deleteMyProduct
};