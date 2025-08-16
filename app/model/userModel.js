import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    image:{
      type: String,
    },
    role: { 
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
      required: true
    }
  },
  { timestamps: true } // createdAt & updatedAt अपने आप बनेंगे
);

const User = mongoose.model('User', userSchema);

export default User;
