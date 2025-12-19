import express from "express";
import Menu from "../models/Menu.js";

const router = express.Router();

/* =========================
   GET LATEST MENU (PUBLIC)
========================= */
router.get("/latest", async (req, res) => {
  try {
    const menu = await Menu.findOne().sort({ createdAt: -1 });
    res.json(menu || { content: "" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   CREATE / UPDATE MENU (ADMIN)
========================= */
router.post("/", async (req, res) => {
  try {
    const role = req.headers["x-user-role"];
    const adminId = req.headers["x-user-id"];

    if (role !== "admin" && role !== "superadmin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Menu content required" });
    }

    const menu = new Menu({
      content,
      createdBy: adminId
    });

    await menu.save();
    res.json({ message: "Menu saved" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
