const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// REGISTER
router.post("/register", async (req, res) => {
    try {
        let { name, email, password } = req.body;

        name = typeof name === "string" ? name.trim() : "";
        email = typeof email === "string"
            ? email.trim().toLowerCase()
            : "";

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (!emailPattern.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email"
            });
        }

        if (typeof password !== "string" || password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "Registration successful"
        });
    } catch (error) {
        console.error("Registration error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        return res.status(500).json({
            message: "Server error"
        });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        let { email, password } = req.body;

        email = typeof email === "string"
            ? email.trim().toLowerCase()
            : "";

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const secret = process.env.JWT_SECRET || "supersecretjwtkey_studentmart_12345";

        const token = jwt.sign(
            { userId: user._id.toString() },
            secret,
            { expiresIn: "2h" }
        );

        return res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;
