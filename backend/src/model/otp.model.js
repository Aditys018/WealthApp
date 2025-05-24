const mongoose = require("mongoose");

// Define the Mongoose schema for OTP
const otpSchema = new mongoose.Schema(
  {
    id: { type: String, required: true }, // Associated ID (e.g., user ID, email, etc.)
    code: { type: String, required: true }, // OTP code
    expiresAt: { type: Date, required: true }, // Expiration time of the OTP
    createdAt: { type: Date, default: () => new Date() },
    verified: { type: Boolean, default: false }, // Whether the OTP has been verified
    email: { type: String, required: true }, // Email associated with the OTP
  },
  { timestamps: true } // Automatically handles createdAt & updatedAt
);

const OTP = mongoose.model("otp", otpSchema);

module.exports = { OTP };