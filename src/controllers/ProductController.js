const mongoose = require('mongoose');
const Product = require('../models/ProductsModel');
const Category = require('../models/CategoryModel');
const asyncFunction = require('../middlewares/asyncMW');

//Additional Part
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('Invalid Image Type');
        if(isValid){
            uploadError = null
        }
        cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.replace(/\s+/g, '-');  // replace spaces with -
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
});


let createProduct = asyncFunction(async(req, res, nxt) => {
    //Additional Part
    const category = await Category.findById(req.body.category);
    if (!category)
        return res.status(400).send('Invalid Category')
    const file = req.file;
    if (!file)
        return res.status(400).send('No image in the request')
    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/uploads/`;

    let product = new Product({
        name: req.body.name,
        price: req.body.price,
        image: `${basePath}${fileName}`, 
        description: req.body.description,
        stock: req.body.stock,
        brand: req.body.brand,
        category: req.body.category,
        rating: req.body.rating
    });
    product = await product.save();
    if (!product)
        return res.status(500).send('Product cannot be created')
    res.send(product);
});

let getProductById = asyncFunction(async(req, res) => {
    let product = await Product.findById(req.params.id).populate('category').select({
        name: 1,
        price: 1,
        image: 1,
        description: 1,
        stock: 1
    });
    if(!product)
        return res.status(500).json({ success: false, message: 'The product with the given ID not exists' })
    res.status(200).send(product);
});

let getAllProducts = asyncFunction(async(req, res) => {
    let filter = {};
    if(req.query.categories)
    {
        filter = {category: req.query.categories.split(',')}
    }
    const productList = await Product.find(filter).populate('category');
    if (!productList) {
        res.status(500), json({success:false})
    }
    res.status(200).send(productList);
});

let countProducts = asyncFunction(async(req, res) => {
    const countPerCategory = await Product.aggregate([{
        $group: {
          _id: "$category",       
          productCount: { $sum: 1 }
        }
    }]).exec();
    res.status(200).send(countPerCategory);
})

let updateProduct = asyncFunction(async(req, res) => {
    if (req.body.category) {
        const category = await Category.findById(req.body.category);
        if (!category) {
            return res.status(400).send("Invalid Category");
        }
    }
    let product = await Product.findByIdAndUpdate(req.params.id, 
        { $set: req.body }, // only fields present in req.body
        { new: true });
    if(!product)
        return res.status(404).send("Product with the given ID is not found");
    res.send(product);
});

let updateImages = asyncFunction(async(req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product ID');
    }
    const files = req.files;
    if (!files || files.length === 0) {
        return res.status(400).send("Please upload at least one image");
    }
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    // map uploaded files to URLs
    const imagesPaths = files.map(file => `${basePath}${file.filename}`);
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        { images: imagesPaths },
        { new: true }
    );
    if (!product) {
        return res.status(500).send('Product cannot be updated');
    }
    res.send(product);
});

let deleteProduct = asyncFunction(async(req, res) => {
    let product = await Product.findByIdAndDelete(req.params.id);
    if(!product)
        return res.status(404).send("Product with the given ID is not found");
    res.send(product);
});


module.exports = {
    createProduct,
    getProductById,
    getAllProducts,
    countProducts,
    updateProduct,
    updateImages,
    deleteProduct
};