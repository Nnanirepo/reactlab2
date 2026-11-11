const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// VIEW PROFILE
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.json({ user });
    } catch (error) {
        console.error("View profile error:", error);

        return res.status(500).json({
            message: "Unable to retrieve profile"
        });
    }
});

// EDIT PROFILE
router.put("/me", authMiddleware, async (req, res) => {
    try {
        const { name, email, phone, department, year, address } =
            req.body;

        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({
                message: "Name is required"
            });
        }

        if (typeof email !== "string" ||
            !emailPattern.test(email.trim())) {
            return res.status(400).json({
                message: "Enter a valid email"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail,
            _id: { $ne: req.userId }
        });

        if (existingUser) {
            return res.status(409).json({
                message: "This email is already registered"
            });
        }

        // Only allow the profile fields defined here.
        const user = await User.findByIdAndUpdate(
            req.userId,
            {
                $set: {
                    name: name.trim(),
                    email: normalizedEmail,
                    phone: typeof phone === "string" ? phone.trim() : "",
                    department: typeof department === "string"
                        ? department.trim() : "",
                    year: typeof year === "string" ? year.trim() : "",
                    address: typeof address === "string"
                        ? address.trim() : ""
                }
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.json({
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        console.error("Edit profile error:", error);

        return res.status(500).json({
            message: "Unable to update profile"
        });
    }
});

// CHANGE PASSWORD
router.put(
    "/change-password",
    authMiddleware,
    async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;

            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    message: "Both password fields are required"
                });
            }

            if (
                typeof newPassword !== "string" ||
                newPassword.length < 6
            ) {
                return res.status(400).json({
                    message: "New password must be at least 6 characters"
                });
            }

            const user = await User.findById(req.userId);

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const isMatch = await bcrypt.compare(
                currentPassword,
                user.password
            );

            if (!isMatch) {
                return res.status(400).json({
                    message: "Current password is incorrect"
                });
            }

            const samePassword = await bcrypt.compare(
                newPassword,
                user.password
            );

            if (samePassword) {
                return res.status(400).json({
                    message: "Choose a different password"
                });
            }

            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();

            return res.json({
                message: "Password changed successfully. Please log in again."
            });
        } catch (error) {
            console.error("Change password error:", error);

            return res.status(500).json({
                message: "Unable to change password"
            });
        }
    }
);

module.exports = router;
