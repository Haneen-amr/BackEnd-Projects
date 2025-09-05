const express = require('express');
const router = express.Router();
const upload = require("../middlewares/upload");

const {checkAdmin} = require("../middlewares/Auth");
const { validateProduct, validateProductUpdate } = require('../middlewares/ProductMWValidator');
const productContoller = require('../controllers/ProductController');


router.post("/", checkAdmin, upload.single("image"), validateProduct, productContoller.createProduct);
router.get("/get/count", productContoller.countProducts); // static first
router.get("/", productContoller.getAllProducts);
router.get("/:id", productContoller.getProductById);      // dynamic after
router.put("/images/:id", checkAdmin, upload.array('images', 10), productContoller.updateImages);
router.put("/:id", checkAdmin, validateProductUpdate, productContoller.updateProduct);
router.delete("/:id", checkAdmin, productContoller.deleteProduct);


module.exports = router;