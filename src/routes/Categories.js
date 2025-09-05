const express = require('express');
const router = express.Router();

const categoryContoller = require('../controllers/CategoryController');
const {checkAdmin} = require("../middlewares/Auth");


router.post("/", checkAdmin, categoryContoller.addCategory);
router.get("/:id", categoryContoller.getCategoryById);
router.get("/", categoryContoller.getAllCategories);
router.put("/:id", checkAdmin, categoryContoller.updateCategory); //resend full update (PATCH -> partial update) 
router.delete("/:id", checkAdmin, categoryContoller.deleteCategory);


module.exports = router;