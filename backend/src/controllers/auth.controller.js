import { generateToken } from "../lib/util.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { email, firstName, lastName, userName, password } = req.body;

  try {
    // Validate required fields
    if (!email || !firstName || !lastName || !userName || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      email,
      firstName,
      lastName,
      userName,
      password: hashedPassword,
    });

    // Save the user and generate token
    await newUser.save();
    generateToken(newUser._id, res);

    res.status(201).json({ message: "User successfully created." });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error." });
  }
};
