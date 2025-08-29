
import User from '../model/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
class UserController {
  async register(req, res) {
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
  async login(req, res) { 
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign({ id: user._id , role: user.role , email: user.email , name: user.name }, process.env.JWT_ACCESS_TOKEN_SECRET_KEY, { expiresIn: '1d' });
      res.status(200).json({ message: "Login successfully", token, data:user });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "Profile fetched successfully", data: user });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  getAllUsersForMembers = async (req, res) => {
    try {
      const users = await User.aggregate([
        { $match: { role: 'user' } },
        { $project: { name: 1, email: 1, image: 1 } },
      ]);
      res.status(200).json({ message: "Users fetched successfully", data: users });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}

export default new UserController();