const User = require("../models/User");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const register = async (req, res) => {
    try {
        const {name, email,password,invitationCode} = req.body;

        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({"msg": "User already exists"});
        }

        //role ek thiranaya krnn
        let userRole = 'customer'; //default role
        if (invitationCode === process.env.ADMIN_SECRET_CODE) {
            userRole = 'admin';
        } else if (invitationCode === process.env.SELLER_SECRET_CODE) {
            userRole = 'seller';
        }

        const user = new User ({
            name,
            email,
            password,
            role: userRole
        });
        await user.save();
        res.status(200).json({"msg": "User registered successfully",user});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const login = async (req, res) => {
    try {
        const {email,password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({"msg": "User does not exist"});
        }

        const isMatch = await user.compare(password);
        if(!isMatch){
            return res.status(400).json({"msg": "Invalid Password"});
        }

        const token = jwt.sign({id: user._id,role: user.role}, 
            process.env.JWT_SECRET,
            {expiresIn: '2h'}
        );
        res.status(200).json({token,"msg": "Login Successful",user});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).
        select('-password');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

const updateUser = async (req, res) => {
    try {
        const { name, email, role, status } = req.body;
        const userToUpdate = await User.findById(req.params.id);

        if (!userToUpdate) {
            return res.status(404).json({ msg: 'User not found' });
        }

        //adminge status ek wens krnn ba
        if (req.user.id === req.params.id && status) {
            return res.status(403).json({ msg: "Admins cannot change their own active/inactive status." });
        }
        
        //wen knek admin krnn ba
        if (role === 'admin' && userToUpdate.role !== 'admin') {
            return res.status(403).json({ msg: "You do not have permission to promote a user to Admin." });
        }
        
        //admin knekge role ek wens krnn ba
        if (userToUpdate.role === 'admin' && role && role !== 'admin' && req.user.id !== req.params.id) {
             return res.status(403).json({ msg: "You cannot change the role of another Admin." });
        }

        //update krnn email ek wen knkeged kiyla blnw
        if (email && email !== userToUpdate.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ msg: "Email is already in use by another account." });
            }
        }
        
        // --- Update Logic ---
        userToUpdate.name = name || userToUpdate.name;
        userToUpdate.email = email || userToUpdate.email;
        userToUpdate.role = role || userToUpdate.role;
        userToUpdate.status = status || userToUpdate.status;

        await userToUpdate.save();
        
        const userResponse = userToUpdate.toObject();
        delete userResponse.password;

        res.status(200).json(userResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update user" });
    }
};



const deleteUser = async (req, res) => {
    try {
        if (req.user.id === req.params.id) {
            return res.status(403).json({msg: "You cannot deactivate your own admin account."});
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status: 'inactive'},
            { new:true}
        ).select('-password');

        res.status(200).json({"msg": "User deactivated successfully",user});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

module.exports = {
    register,
    login,
    getProfile,
    getAllUsers,
    updateUser,
    deleteUser
}