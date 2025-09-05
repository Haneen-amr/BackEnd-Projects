const Category = require('../models/CategoryModel');
const asyncFunction = require('../middlewares/asyncMW');


let addCategory = asyncFunction(async(req, res, nxt) => {
    let category = await Category.findOne({name: req.body.name}).exec();
    if(category)
        return res.status(400).send("This category already exists!");
    
    category = new Category({
        name: req.body.name,
        description: req.body.description
    });
        
    await category.save();
    res.status(200).send({category: category.name});
});

let getCategoryById = asyncFunction(async(req, res) => {
    let category = await Category.findById(req.params.id).select({
        name: 1,
        description: 1
    });
    if(!category)
        return res.status(500).json({success: false, message: 'The category with the given ID not exists'});
    res.send(category);
});

let getAllCategories = asyncFunction(async(req, res) => {
    let categoryList = await Category.find().select({
        name: 1,
        description: 1
    });
    if (!categoryList) {
        res.status(500).json({ success: false})
    }
    res.status(200).send(categoryList)
});

let updateCategory = asyncFunction(async(req, res) => {
    let category = await Category.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        description: req.body.description
    }, { 
        new: true 
    });
    if(!category)
        return res.status(404).send("Category with the given ID is not found");
    res.send(category);
});

let deleteCategory = asyncFunction(async(req, res) => {
    let category = await Category.findByIdAndDelete(req.params.id);
    if(!category)
        return res.status(404).send("Category with the given ID is not found");
    return res.status(200).json({ success: true, message: 'Category deleted successfully'})
});


module.exports = {
    addCategory,
    getCategoryById,
    getAllCategories,
    updateCategory,
    deleteCategory
};