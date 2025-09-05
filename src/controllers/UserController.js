const User = require('../models/UserModel');
const Token = require("../models/TokenModel");
const asyncFunction = require('../middlewares/asyncMW');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


let userRegisteration = asyncFunction(async(req, res, nxt) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        city: req.body.city,
        country: req.body.country
    });
    user = await user.save();
    if (!user)
        return res.status(404).send('User cannot be created')
    res.send(user);
});

let userLogin = asyncFunction(async(req, res, nxt) => {
    const secret = process.env.secret;
    let user = await User.findOne({email: req.body.email})
    if(!user)
        return res.status(400).send("Invalid email or password!");
    //check password
    const validPswd = await bcrypt.compare(req.body.password, user.password);
    if(!validPswd)
        return res.status(400).send("Invalid email or password!");
    const token = jwt.sign(
        { userId: user._id, isAdmin: user.isAdmin },
        secret,
        { expiresIn: "1d" }
    );
    console.log("JWT Payload:", { userId: user._id, isAdmin: user.isAdmin });
    console.log("SIGNED TOKEN:", token);
    await Token.create({ token, userId: user._id, status: "active" }); // save in DB as active
    return res.status(200).send({
        message: "You've successfully logged in.",
        email: user.email, 
        token: token});
});

let getUserById = asyncFunction(async(req, res) => {
    let user = await User.findById(req.params.id).select({
        id: 1,
        name: 1, 
        email: 1,
        phone: 1,
        isAdmin: 1
    });
    if(!user)
        return res.status(404).send("User with the given ID is not found");
    res.send(user);
})

let getAllUsers = asyncFunction(async(req, res) => {
    let userList = await User.find()
      .select("_id name email") 
      .sort({ _id: -1 });       

    if (userList.length === 0) {
      return res.status(404).json({ success: false, message: "No users found" });
    }

    res.json(userList);
})

let updateUser = asyncFunction(async (req, res) => {
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    // Find the existing user first
    const existingUser = await User.findById(req.params.id);
    if (!existingUser) {
        return res.status(404).send("User not found");
    }
    // If email is in the update body and it's different, check for duplicates
    if (req.body.email && req.body.email !== existingUser.email) {
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) {
            return res.status(400).send("This Email is Already Used!");
        }
    }
    const user = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.send(user);
});


let deleteUserById = asyncFunction(async(req, res, nxt) => {
    let user = await User.findByIdAndDelete(req.params.id);
    if (user) {
        return res.status(200).json({ success: true, message: 'User deleted successfully' })
    } else {
        return res.status(404).json({ success: false, message: 'User cannot find' })
    }
})


let userLogout = asyncFunction(async (req, res, nxt) => {
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"
    console.log("Extracted token:", token); 
    if (token) {
        const savedToken = await Token.findOne({ token });
        if (savedToken) {
            savedToken.status = "revoked";
            await savedToken.save();
        } else {
            // if token not in DB, add it as revoked
            await Token.create({ token, status: "revoked" });
        }
        console.log("Successfully Logged Out");
        return res.status(200).json({ success: true, message: "You've Logged Out Successfully!" });
    }
    console.log("Invalid User");
    return res.status(401).json({ success: false, message: "User Not Validated!" });
});



module.exports = {
    userRegisteration,
    userLogin,
    getUserById,
    getAllUsers,
    updateUser,
    deleteUserById,
    userLogout
};