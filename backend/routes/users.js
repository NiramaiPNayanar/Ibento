import express from "express";
import User from "../models/User.js";

const router = express.Router();

/* =========================
   GET USERS (ROLE AWARE)
========================= */
router.get("/", async (req, res) => {
  try {
    const role = req.headers["x-user-role"];
    const userId = req.headers["x-user-id"];

    let query = {};

    // Admin sees only users created by them
    if (role === "admin") {
      query = { createdBy: userId };
    }

    // Superadmin sees all
    const users = await User.find(query).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   GET SINGLE USER (ADMIN)
========================= */
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   CREATE USER
========================= */
router.post("/", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const creatorId = req.headers["x-user-id"];

    if (!username || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const user = new User({
      username,
      password,
      role,
      createdBy: creatorId || null
    });

    await user.save();
    res.status(201).json({ message: "User created" });
  } catch (err) {
    if (err.code === 11000) {
      res.status(409).json({ error: "Username already exists" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

/* =========================
   UPDATE MENU (ADMIN / SUPERADMIN)
========================= */
router.patch("/:id/menu", async (req, res) => {
  try {
    const role = req.headers["x-user-role"];
    const { menu } = req.body;

    if (role !== "admin" && role !== "superadmin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    await User.findByIdAndUpdate(req.params.id, { menu });
    res.json({ message: "Menu updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   GET MENU BY ADMIN ID (GUEST)
========================= */
router.get("/menu/:adminId", async (req, res) => {
  try {
    const admin = await User.findById(req.params.adminId).select("menu username");

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.json({
      admin: admin.username,
      menu: admin.menu
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   UPDATE ROLE (SUPERADMIN)
========================= */
router.patch("/:id/role", async (req, res) => {
  try {
    const requesterRole = req.headers["x-user-role"];

    if (requesterRole !== "superadmin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { role } = req.body;
    await User.findByIdAndUpdate(req.params.id, { role });

    res.json({ message: "Role updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   DELETE USER (SUPERADMIN)
========================= */
router.delete("/:id", async (req, res) => {
  try {
    const requesterRole = req.headers["x-user-role"];

    if (requesterRole !== "superadmin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
