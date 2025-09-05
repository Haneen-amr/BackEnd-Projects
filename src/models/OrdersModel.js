const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    user: {
        //4bh fekret el foreign keys
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'OrderItem',
        required: true
    }],
    shippingAddress1: {
        type: String,
        required: true
    },
    shippingAddress2: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'pending'
    },
    totalPrice: {
        type: Number
    },
    dateOrdered: {
        type: Date,
        default: Date.now
    }
});


//Additional Part:
orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals: true,
});


module.exports = mongoose.model('Order', orderSchema);