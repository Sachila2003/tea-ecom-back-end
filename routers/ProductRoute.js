const express = require("express");
const router = express.Router();

const { 
    createProduct, 
    getAllProducts, 
    getAllProductsForAdmin,
    updateProduct, 
    deleteProduct 
} = require("../controllers/ProductController");

const { auth, role } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/", getAllProducts);
router.get("/all", auth, role('admin'), getAllProductsForAdmin);
router.post("/", auth, role('seller', 'admin'), upload.single("image"), createProduct);
router.put("/:id", auth, role('admin'), upload.single('image'), updateProduct);
router.delete("/:id", auth, role('admin'), deleteProduct);


module.exports = router;