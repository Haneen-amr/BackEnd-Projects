const express = require('express');
const router = express.Router();

const {checkAdmin, checkNonAdminUser, checkAuth} = require("../middlewares/Auth");
const orderController = require('../controllers/OrderController');


router.post("/", checkNonAdminUser, orderController.placeOrder);
router.get("/", checkAdmin, orderController.getAllOrders);
router.get("/user/:id", checkAuth, orderController.getUserOrders);
router.get("/:id", checkAuth, orderController.getOrderById);
router.patch("/:id", checkAdmin, orderController.updateOrder); //(PATCH -> partial update) 
router.delete("/:id", checkAuth, orderController.deleteOrder);

module.exports = router;