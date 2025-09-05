const express = require('express');
const router = express.Router();

const {checkAdmin, checkOwnerOrAdmin} = require("../middlewares/Auth");
const {validateRegister, validateUpdate} = require('../middlewares/UserMWValidator');
const userController = require('../controllers/UserController');


//Registration Route Handler:
router.post("/register", validateRegister, userController.userRegisteration);
router.post("/login", userController.userLogin);
router.post("/logout", userController.userLogout);
router.get("/", checkAdmin, userController.getAllUsers);
router.get("/:id", checkAdmin, userController.getUserById);
router.put("/:id", validateUpdate, checkOwnerOrAdmin, userController.updateUser);
router.delete("/:id", checkAdmin, userController.deleteUserById);


module.exports = router;