import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import photoRoutes from "./routes/photos.js";
import menuRoutes from "./routes/menu.js";


const app = express();

// middleware
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/photos", photoRoutes);
// routes
app.use("/api/users", userRoutes);
app.use("/api/menu", menuRoutes);

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/ibento", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () =>
      console.log("Backend running on http://localhost:5000")
    );
  })
  .catch((err) => console.error("MongoDB error:", err));
