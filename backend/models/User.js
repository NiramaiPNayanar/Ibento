import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // plain for demo
  role: {
    type: String,
    enum: ["guest", "photographer", "admin", "superadmin"],
    default: "guest"
  },

  photos: { type: [String], default: [] },

  menu: {
    type: String,
    default: ""
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
