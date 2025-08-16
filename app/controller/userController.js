
import User from '../model/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
class UserController {
    async register(req, res) {
        try {
           const { name, email,phone, password , roll  } = req.body;
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

      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = await new User({
        name,
        email,
        phone,
        password: hashedPassword,
        roll: roll || 'user', 
        image: req.file ? `/uploads/${req.file.filename}` : null,

      }).save();

      res.status(201).json({
        message: "User created successfully",
        data: user,
      });

        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
    async login(req, res) { }
}

export default new UserController();