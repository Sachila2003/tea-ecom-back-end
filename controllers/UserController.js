// controllers/UserController.js

const User = require("../models/User");
const jwt = require('jsonwebtoken');
require('dotenv').config();

// 1. Register
const register = async (req, res) => {
    try {
        const { name, email, password, invitationCode } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ msg: "Please provide all required fields." });
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ msg: "User already exists" });
        }

        let userRole = 'customer';
        if (invitationCode === process.env.ADMIN_SECRET_CODE) userRole = 'admin';
        else if (invitationCode === process.env.SELLER_SECRET_CODE) userRole = 'seller';

        const user = new User({ name, email, password, role: userRole });
        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;
        res.status(201).json({ msg: "User registered successfully", user: userResponse });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ msg: "Please provide email and password." });

        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(401).json({ msg: "Invalid credentials" });

        const isMatch = await user.compare(password);
        if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });
        const userResponse = user.toObject();
        delete userResponse.password;
        
        res.status(200).json({ token, msg: "Login Successful", user: userResponse });
    } catch (error) {
        res.status(500).json({ msg: "Server error during login" });
    }
};

// 3. Get Own Profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get user profile' });
    }
};

// 4. Update Own Profile
const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ msg: 'User not found' });
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(400).json({ msg: "Email is already in use." });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        if (req.file) {
            user.profilePic = req.file.path.replace(/\\/g, "/");
        }

        await user.save();
        const userResponse = user.toObject();
        delete userResponse.password;
        res.status(200).json(userResponse);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

// 5. Change Own Password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) return res.status(400).json({ msg: 'Please provide all required fields.' });
        
        const user = await User.findById(req.user.id).select('+password');
        if (!user) return res.status(404).json({ msg: 'User not found.' });
        
        const isMatch = await user.compare(currentPassword);
        if (!isMatch) return res.status(401).json({ msg: 'Incorrect current password.' });

        user.password = newPassword;
        await user.save();
        res.status(200).json({ msg: 'Password updated successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Server error while changing password' });
    }
};

// --- Admin-Only Functions ---

// 6. Get All Users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

// 7. Update Any User by ID
const updateUser = async (req, res) => {
    try {
        const { name, email, role, status } = req.body;
        const userToUpdate = await User.findById(req.params.id);

        if (!userToUpdate) return res.status(404).json({ msg: 'User not found' });
        
        // Safety Checks
        if (req.user.id === req.params.id && (role || status)) {
             return res.status(403).json({ msg: "Admins cannot change their own role or status." });
        }
        if (role === 'admin' && userToUpdate.role !== 'admin') {
            return res.status(403).json({ msg: "Cannot promote a user to Admin." });
        }
        
        userToUpdate.name = name || userToUpdate.name;
        userToUpdate.email = email || userToUpdate.email;
        userToUpdate.role = role || userToUpdate.role;
        userToUpdate.status = status || userToUpdate.status;

        await userToUpdate.save();
        res.status(200).json(userToUpdate);
    } catch (error) {
        res.status(500).json({ error: "Failed to update user" });
    }
};

// 8. Delete Any User by ID (Soft Delete)
const deleteUser = async (req, res) => {
    try {
        if (req.user.id === req.params.id) {
            return res.status(403).json({msg: "You cannot deactivate your own admin account."});
        }
        const user = await User.findByIdAndUpdate(req.params.id, { status: 'inactive'}, { new:true });
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.status(200).json({ "msg": "User deactivated successfully", user });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
    getAllUsers,
    updateUser,
    deleteUser
};