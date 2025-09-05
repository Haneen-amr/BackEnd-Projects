const Order = require('../models/OrdersModel');
const OrderItem = require('../models/orderItemModel');
const Product = require('../models/ProductsModel');
const asyncFunction = require('../middlewares/asyncMW');

let getUserOrders = asyncFunction(async(req, res, nxt) => {
    const userId = req.params.id;
    // Allow admin OR owner of the order
    if (!req.auth.isAdmin && req.auth.userId !== userId) {
        return res.status(403).json({
            success: false,
            message: 'You are not allowed to access other user\'s profile'
        });
    }
    const orderList = await Order.find({user: userId})
    .populate('user', 'name').sort({'dateOrdered':-1})
    .populate({ 
        path: 'items', 
        populate: { 
            path: 'product', 
            populate: 'category'
        }
    });
    if (!orderList || orderList.length === 0) {
        return res.status(404).json({ success: false, message: "No Orders Found!" })
    }
    return res.send(orderList)
});

let getOrderById = asyncFunction(async(req, res, nxt) => {
    const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate({ 
        path: "items", 
        populate: { path: "product", populate: "category" }
    });
    if (!req.auth.isAdmin && order.user._id.toString() !== req.auth.userId) {
        return res.status(403).json({ 
            success: false, 
            error: {
                code: "FORBIDDEN",
                message: "You are not allowed to access this order."
            }
        });
    }
    if (!order) {
        return res.status(404).json({ success: false, message: "Order Not Found!" })
    }
    return res.send(order)
});

let getAllOrders = asyncFunction(async(req, res) => {
    let orderList = await Order.find().select({
        user: 1,
        items: 1,
        shippingAddress1: 1,
        phone: 1,
        status: 1,
        totalPrice: 1
    });
    if (!orderList) {
        return res.status(500).json({ success: false, message: "No orders found"})
    }
    return res.status(200).send(orderList)
});

let placeOrder = asyncFunction(async (req, res) => {
    if (req.auth.isAdmin) {
    return res
      .status(403)
      .json({ success: false, message: "Admins cannot place orders directly" });
    }

    const { orderItems, shippingAddress, city, country, phone, status } = req.body;

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
        return res.status(400).json({ success: false, message: "orderItems must be a non-empty array" });
    }

    // Insert order items into DB
    const items = await OrderItem.insertMany(
        orderItems.map((item) => ({
        quantity: item.quantity,
        product: item.productId, 
        }))
    );

    const orderItemsIds = items.map((item) => item._id);

    // Calculate total price
    const totalPrice = await Promise.all(
        items.map(async (item) => {
        const product = await Product.findById(item.product).select("price");
        return product.price * item.quantity;
        })
    ).then((prices) => prices.reduce((a, b) => a + b, 0));

    const order = new Order({
        items: orderItemsIds,
        shippingAddress1: shippingAddress,
        city,
        country,
        phone,
        status,
        totalPrice,
        user: req.auth.userId,
    });

    const savedOrder = await order.save();
    const populatedOrder = await savedOrder.populate("user", "name email");

    if (!savedOrder) {
        return res.status(400).send("Order cannot be created");
    }

    res.send(populatedOrder);
});


let updateOrder =  asyncFunction(async(req, res, nxt) => {
    if (!req.auth.isAdmin) {
        return res.status(403).json({ success: false, message: "Only admins can update order status" });
    };
    const { status } = req.body;
    if (!status) {
        return res.status(400).json({ success: false, message: "Order's Status is not Updated!"});
    }
    const order = await Order.findByIdAndUpdate(req.params.id, 
        { status }, 
        { new: true }
    );
    if (!order){
        return res.status(404).send('Order cannot be created')
    }
    return res.send(order);
});

let deleteOrder = asyncFunction(async(req, res, nxt) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
    } 
    // Allow admin OR owner of the order
    if (!req.auth.isAdmin && order.user.toString() !== req.auth.userId) {
        return res.status(403).json({
            success: false,
            message: 'You are not allowed to delete this order'
        });
    }
    await Order.findByIdAndDelete(req.params.id);

    return res.status(200).json({ success: true, message: 'Order deleted successfully' });
});


module.exports = {
    getUserOrders,
    getOrderById,
    getAllOrders,
    placeOrder,
    updateOrder,
    deleteOrder
};