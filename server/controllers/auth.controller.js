import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { TryCatch } from "../middlewares/error.js";
import { sendToken, uploadFilesToCloudinary } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";
import { ADMIN_SECRET_KEY, JWT_SECRET, CHATTER_BOX_ADMIN_TOKEN, CHATTER_BOX_TOKEN, COOKIE_OPTIONS } from "../constants/index.js";

// Register a new user and save it to the database
const register = TryCatch(async (req, res, next) => {
  const { name, username, password, bio } = req.body;

  if (!req.file) return next(new ErrorHandler("Please upload an avatar", 400));

  const [{ public_id, url }] = await uploadFilesToCloudinary([req.file]);
  const user = await User.create({ name, username, password, bio, avatar: { public_id, url } });

  sendToken(res, user, 201, "User registered successfully!");
});

// Login user
const login = TryCatch(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select("+password");

  if (!user || !user.comparePassword(password)) {
    return next(new ErrorHandler("Invalid username or password", 401));
  }

  sendToken(res, user, 200, `Welcome back, ${user.name}`);
});

// Admin Login
const adminLogin = TryCatch(async (req, res, next) => {
  const { secretKey } = req.body;

  const isMatched = secretKey === ADMIN_SECRET_KEY;

  if (!isMatched) return next(new ErrorHandler("Invalid Admin Key", 401));

  const token = jwt.sign(secretKey, JWT_SECRET);

  return res.status(200).cookie(CHATTER_BOX_ADMIN_TOKEN, token, { ...COOKIE_OPTIONS, maxAge: 1000 * 60 * 15 })
    .json({ success: true, message: "Authenticated Successfully!, Welcome Admin!" });
});

// Logout User & Admin
const logout = TryCatch(async (req, res) => {
  return res.status(200)
    .cookie(CHATTER_BOX_TOKEN, "", { ...COOKIE_OPTIONS, maxAge: 0 })
    .cookie(CHATTER_BOX_ADMIN_TOKEN, "", { ...COOKIE_OPTIONS, maxAge: 0 })
    .json({ success: true, message: "Logged out successfully" });
});

// Get current user
const getCurrentUser = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user);
  if (!user) return next(new ErrorHandler("User not found", 404));

  return res.status(200).json({ success: true, user });
});

export const authController = { register, login, adminLogin, logout, getCurrentUser };
