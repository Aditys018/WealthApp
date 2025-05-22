const mongoose = require("mongoose");

// Define the Mongoose schema
const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    phoneNumber: { type: String, required: true, match: /^\+\d{1,15}$/ }, // Supports international format
    role: { type: String, enum: ["ADMIN", "USER"], required: true },
    isPasswordResetRequired: { type: Boolean, default: false },
    undertakingUser: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }], // References other users
    managedCompanies: [{ type: mongoose.Schema.Types.ObjectId, ref: "company" }], // References companies managed by this admin
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },
    status: { type: String, required: true },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true } // Automatically handles createdAt & updatedAt
);

const Admin = mongoose.model("admin", adminSchema);

module.exports = { Admin };