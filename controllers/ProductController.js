const Product = require("../models/Product");

const createProduct = async (req, res) => {
    try {
        const { title, description, price, stock, category } = req.body;
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
            imageUrl,
            stock: stock || 0,
            category: category || 'Uncategorized',
            seller: req.user.id
        });

        const savedProduct = await newProduct.save();
        res.status(201).json({ message: "Product added successfully!", product: savedProduct });

    } catch (error) {
        console.error("Server Error in createProduct:", error);
        res.status(500).json({ message: "Server error occurred.", error: error.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}).populate('seller', 'name');
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Error fetching products from server." });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { title, description, price, status,stock, category} = req.body;
        const product = await Product.findByIdAndUpdate(req.params.id,
            {
                title,
                description,
                price,
                status,
                stock,
                category
            },
            {new: true, runValidators: true}
        );
        if (!product){
            return res.status(404).json({ message: "Product not found." });
        }
        res.status(200).json({ message: "Product updated successfully!", product });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Error updating product from server." });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product){
            return res.status(404).json({ message: "Product not found." });
        }
        res.status(200).json({ message: "Product deleted successfully!" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Error deleting product from server." });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
};