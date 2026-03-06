import jwt from "jsonwebtoken";

import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { validateAuthPayload } from "../utils/validators.js";

const createToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

export const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const errors = validateAuthPayload({ email, password });

  if (errors.length) {
    throw new ApiError(400, "Invalid registration payload.", errors);
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new ApiError(409, "A user with this email already exists.");
  }

  const user = await User.create({
    email: normalizedEmail,
    password,
  });

  res.status(201).json({
    message: "Registration successful.",
    token: createToken(user._id),
    user: {
      id: user._id,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const errors = validateAuthPayload({ email, password });

  if (errors.length) {
    throw new ApiError(400, "Invalid login payload.", errors);
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Email or password is incorrect.");
  }

  res.status(200).json({
    message: "Login successful.",
    token: createToken(user._id),
    user: {
      id: user._id,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
});
