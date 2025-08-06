const express = require('express');
const User = require('../models/user');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const dotenv = require('dotenv');
dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET

// register route
exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: 'User already exists' });

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();

        return res.status(201).json({ message: 'User registered successfully' });

    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: 'Server Error' });
    }
}

// login route
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: 'User does not exist' });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        // create jwt token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role
            }
        });
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: 'Server Error' });
    }
}

// get users
// get users (with optional role filter)
exports.getUsers = async (req, res) => {
    try {
        const role = req.query.role;
        const filter = role ? { role } : {}; // if role exists, filter by it
        const users = await User.find(filter);
        res.json({ users });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

