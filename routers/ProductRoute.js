const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/ProductController");
const upload = require("../middleware/upload");

router.post("/create", upload.single("image"), ProductController.createProduct);
router.get("/", ProductController.getAllProducts);

module.exports = router;
