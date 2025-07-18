import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id); // ⬅️ use `_id` not `id`
    if (!user) {
      return res.status(401).json({ success: false, error: "User not found" });
    }

    req.user = { id: user._id, role: user.role };
    next();
  } catch (err) {
    console.error("Auth Error:", err.message);
    res.status(401).json({ success: false, error: "Invalid token" });
  }
};
