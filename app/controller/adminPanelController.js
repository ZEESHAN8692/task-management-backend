import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";


class AdminPanelController {

    async createUser(req, res) {
        try {
            const { name, email, phone, password, roll } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({
                    message: "All fields are required",
                });
            }
            const existUser = await User.findOne({ email });
            if (existUser) {
                return res.status(400).json({
                    message: "User already exist",
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await new User({
                name,
                email,
                phone,
                password: hashedPassword,
                roll: roll || 'user',
                image: req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null,

            }).save();

            res.status(201).json({
                message: "User created successfully",
                data: user,
            });

        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }

    async updateUser(req, res) {
        try {
            const { name, phone, email, address, role, image } = req.body;

            const user = await User.findById(req.params.id);
            if (!user) return res.status(404).json({ message: "User not found" });

            user.name = name || user.name;
            user.phone = phone || user.phone;
            user.email = email || user.email;
            user.address = address || user.address;
            user.role = role || user.role;

            if (image) {
                const imagePath = user.image.replace('/uploads/', '');
                const imagePathFull = path.join(process.cwd(), 'uploads', imagePath);
                if (fs.existsSync(imagePathFull)) {
                    fs.unlinkSync(imagePathFull);
                }
                user.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            }

            await user.save();
            res.json({ message: "User updated", user: { ...user._doc, password: undefined } });
        } catch (error) {
            res.status(500).json({ message: "Error updating user", error: error.message });
        }
    };

    async getAllUsers(req, res) {
        try {
            const users = await User.find({}).select("-password");
            res.status(200).json({
                message: "Users fetched successfully",
                data: users,
            });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
    async getSingleUser(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                });
            }
            res.status(200).json({
                message: "User fetched successfully",
                data: user,
            });
        } catch (error) {
            res.status(500).json({
                message: "Server error", error: error.message
            })

        }
    }
    async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const deletedUser = await User.findByIdAndDelete(userId);
            if (deletedUser.image) {
                const imagePath = deletedUser.image.replace('/uploads/', '');
                const imagePathFull = path.join(process.cwd(), 'uploads', imagePath);
                if (fs.existsSync(imagePathFull)) {
                    fs.unlinkSync(imagePathFull);
                }
            }
            res.status(200).json({
                message: "User deleted successfully",
                data: deletedUser,
            });
        } catch (error) {
            res.status(500).json({
                message: "Server error", error: error.message
            })
        }
    }
}

export default new AdminPanelController()