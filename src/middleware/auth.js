import jwt from "jsonwebtoken";
import User from "../models/User.js";

const auth = async (req, res, next) => {
  try {
    // 1. Read JWT from signed or unsigned cookie
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authentication token",
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Fetch user and attach to request
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    req.user = user;

    // 4. Continue
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }
};

export default auth;
