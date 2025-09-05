const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    image: {
      type: String
    },
    images: {
      type: [String]
    },
    description: {
      type: String,
      required: true
    },
    brand: {
        type: String
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    stock: {
      type: Number,
      required: true
    },
    rating: {
      type: Number,
      default: 0
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});


//Additional Part:
productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});


module.exports = mongoose.model("Product", productSchema);