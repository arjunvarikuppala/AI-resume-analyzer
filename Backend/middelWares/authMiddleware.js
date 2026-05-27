import jwt from "jsonwebtoken";

import User from "../Models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

const authMiddleware = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || "";

  if (!header.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication token is missing.");
  }

  const token = header.replace("Bearer ", "").trim();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      throw new ApiError(401, "The authenticated user no longer exists.");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(401, "Invalid or expired authentication token.");
  }
});

export default authMiddleware;
