import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/upload", async (req, res) => {
  const { userId, image } = req.body;

  if (!userId || !image) {
    return res.status(400).json({ error: "Missing data" });
  }

  await User.findByIdAndUpdate(userId, {
    $push: { photos: image }
  });

  res.json({ message: "Photo uploaded" });
});

export default router;
