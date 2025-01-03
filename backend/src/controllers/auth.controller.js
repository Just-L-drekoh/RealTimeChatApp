import { generateToken } from "../lib/util.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { email, firstName, lastName, userName, password } = req.body;

  try {
    if (!email || !firstName || !lastName || !userName || !password) {
      return res
        .status(400)
        .json({ message: "Tout les champs sont obligatoires." });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Votre mot de passe doit contenir au moins 6 caractères.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Un Utilisateur avec cette adresse mail existe deja.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      firstName,
      lastName,
      userName,
      password: hashedPassword,
    });

    await newUser.save();
    const token = generateToken(newUser._id, res);
    console.log(token);
    res
      .status(201)
      .json({ message: "Votre compte a été créé avec succès .", token: token });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Une erreur est survenu ." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Tout les champs sont obligatoires." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Mot de passe incorrect." });
    }

    const token = generateToken(user._id, res);
    res.status(200).json({ message: "Vous êtes connecté.", token: token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Une erreur est survenu." });
  }
};

export const logout = (req, res) => {
  try {
    if (!req.cookies.jwt) {
      return res.status(400).json({ message: "Vous n'êtes pas connecté." });
    }
    res.clearCookie("jwt");
    res.status(200).json({ message: "Vous êtes déconnecté." });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Une erreur est survenu." });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
