const express = require('express');
const router = express.Router();

const {checkNonAdminUser} = require("../middlewares/Auth");
const {validateAddtoCart, validateUpdateCart, validateRemoveFromCart} = require('../middlewares/CartMWValidator');
const cartController = require('../controllers/CartController');


//Registration Route Handler:
router.post("/add", checkNonAdminUser, validateAddtoCart, cartController.addToCart);
router.post("/remove", checkNonAdminUser, validateRemoveFromCart, cartController.removeFromCart);
router.put("/update", checkNonAdminUser, validateUpdateCart, cartController.updateItemQuantity);
router.get("/", checkNonAdminUser, cartController.getCart);
router.delete("/clear", checkNonAdminUser, cartController.clearCart);


module.exports = router;