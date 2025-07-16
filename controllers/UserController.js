const User = require("../models/User");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const register = async (req, res) => {
    try {
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
            status: req.body.status
        });
        await user.save(); //await eka dnne save eken psse anith ekt ynna
        // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // { expiresIn: '2h' }
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isMatch = await user.compare(password);
        if(!isMatch){
            return res.status(400).json({ message: "Invalid Password" });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        { expiresIn: '2h' }
        res.status(200).json({token, "msg": "Login successful",user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getProfile = async (req, res) => {
    try {
        const user = await user.findById(req.user.id).select("-password");
        res.status(200).json({user});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { register, login }
