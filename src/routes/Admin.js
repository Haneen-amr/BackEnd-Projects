const express = require('express');
const router = express.Router();
const asyncFunction = require('../middlewares/asyncMW');

const {checkAdmin} = require("../middlewares/Auth");
const User = require('../models/UserModel');

//Updating User's Role:
router.put("/:id", checkAdmin, asyncFunction(async(req, res) => {
    const { isAdmin } = req.body;
    const user = await User.findByIdAndUpdate(
        req.params.id,
        { isAdmin }, 
        { new: true } // return updated doc
    );
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }
    return res.status(200).json({ success: true, message: "User role set to Admin", user });
}));

module.exports = router;