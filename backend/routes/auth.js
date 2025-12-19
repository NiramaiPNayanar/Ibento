import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // using username as email for now
  const user = await User.findOne({ username: email });

  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({
    id: user._id,
    role: user.role
  });
});

export default router;
