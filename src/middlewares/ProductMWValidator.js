const validator = require("../utils/ProductsValidator");
const Category = require("../models/CategoryModel");
const mongoose = require("mongoose");



function validate(schemaValidator) {
  return async (req, res, next) => {
    try {
      // If there's a file, store filename
      if (req.file) {
        req.body.image = req.file.filename;
      }

      // Convert numeric fields
      if (req.body.price) req.body.price = Number(req.body.price);
      if (req.body.stock) req.body.stock = Number(req.body.stock);

      // Run AJV validation
      const valid = schemaValidator(req.body);
      console.log("VALIDATION RESULT:", valid);

      if (!valid) {
        console.log("VALIDATION ERRORS:", schemaValidator.errors);
        return res.status(400).json({ errors: schemaValidator.errors });
      }

      // Handle category only if provided
      if (req.body.category) {
        let categoryId;
        if (mongoose.Types.ObjectId.isValid(req.body.category)) {
            categoryId = req.body.category;
        } else {
            const categoryDoc = await Category.findOne({ name: req.body.category });
            if (!categoryDoc) {
            return res.status(400).json({ error: "Category not found" });
            }
            categoryId = categoryDoc._id;
        }
        req.body.category = categoryId;
        }


      next();
    } catch (err) {
      console.error("Error validating product:", err);
      res.status(500).json({ error: "Server error while validating category" });
    }
  };
}




module.exports = {
    validateProduct: validate(validator.validateProduct),
    validateProductUpdate: validate(validator.validateProductUpdate),
};