const Cart = require('../models/CartModel');
const asyncFunction = require('../middlewares/asyncMW');

let addToCart = asyncFunction(async(req, res, nxt) => {
    let cart = await Cart.findOne({ user: req.auth.userId });
    if (!cart) {
        cart = new Cart({
            user: req.auth.userId,
            items: [{ product: req.body.product, quantity: req.body.quantity || 1 }]
        });
    } else {
        const existingItem = cart.items.find(
            item => item.product.toString() === req.body.product
        );

        if (existingItem) {
            existingItem.quantity += req.body.quantity || 1;
        } else {
            cart.items.push({ product: req.body.product, quantity: req.body.quantity || 1 });
        }
    }
    await cart.save();
    res.send(cart);
});

let removeFromCart = asyncFunction(async(req, res) => {
    let cart = await Cart.findOne({ user: req.auth.userId });
    if (!cart) 
        return res.status(404).send("Cart not found!");
    const { product, quantity } = req.body;
    const itemIndex = cart.items.findIndex(i => i.product.toString() === product);

    if (itemIndex === -1) {
        return res.status(404).send("Product not found in cart");
    }
    // If quantity provided, decrease instead of removing
    if (quantity && quantity > 0) {
        if (cart.items[itemIndex].quantity > quantity) {
            cart.items[itemIndex].quantity -= quantity;
        } else {
            cart.items.splice(itemIndex, 1);
        }
    } else {
        // no quantity provided → remove completely
        cart.items.splice(itemIndex, 1);
    }
    await cart.save();
    res.send(cart);
});

let updateItemQuantity = asyncFunction(async(req, res) => {
    let cart = await Cart.findOne({ user: req.auth.userId });
    if (!cart) 
        return res.status(404).send("Cart not found!");
    const item = cart.items.find(
        item => item.product.toString() === req.body.product
    );
    if (!item) 
        return res.status(404).send("Product not found in cart");
    item.quantity = req.body.quantity;
    await cart.save();
    res.send(cart);
});

let getCart = asyncFunction(async(req, res) => {
    console.log("Decoded token payload:", req.auth);
    const userId = req.auth?.userId;
    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized: userId missing in token" });
    }
    let cart = await Cart.findOne({ user: userId })
        .populate("items.product", "name price category");
    if (!cart) {
        return res.status(404).json({ success: false, message: "Cart not found!" });
    }
    res.json({ success: true, cart });
});

let clearCart = asyncFunction(async(req, res) => {
    let cart = await Cart.findOne({ user: req.auth.userId });
    if (!cart) 
        return res.status(404).send("Cart not found!");
    cart.items = [];
    await cart.save();
    res.send("Cart cleared successfully");
});

module.exports = {
    addToCart,
    removeFromCart,
    updateItemQuantity,
    getCart,
    clearCart
};
