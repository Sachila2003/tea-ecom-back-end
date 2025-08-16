const express = require("express");
const router = express.Router();

const { 
    createProduct, 
    getAllProducts, 
    getAllProductsForAdmin,
    updateProduct, 
    deleteProduct,
    getSellerProducts,
    updateMyProduct,
    deleteMyProduct 
} = require("../controllers/ProductController");

const { auth, role } = require("../middleware/auth");
const upload = require("../middleware/upload");


router.get("/", getAllProducts);
router.get("/all", auth, role('admin'), getAllProductsForAdmin);
router.post("/", auth, role('seller', 'admin'), upload.single("image"), createProduct);
router.put("/:id", auth, role('admin'), upload.single('image'), updateProduct);
router.delete("/:id", auth, role('admin'), deleteProduct);
router.get("/my-products", auth, role('seller', 'admin'), getSellerProducts);
router.put("/my-products/:id", auth, role('seller', 'admin'), upload.single('image'), updateMyProduct);
router.delete("/my-products/:id", auth, role('seller', 'admin'), deleteMyProduct);

module.exports = router;