import mongoose, { Schema } from "mongoose";
import { IAdminUser } from "../types";

// Define the Mongoose schema
const adminSchema = new Schema<IAdminUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    phoneNumber: { type: String, required: true, match: /^\+\d{1,15}$/ }, // Supports international format
    role: { type: String, enum: ["ADMIN", "USER"], required: true },
    isPasswordResetRequired: { type: Boolean, default: false },
    undertakingUser: [{ type: Schema.Types.ObjectId, ref: "User" }], // References other users
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },
    status: { type: String, required: true },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true } // Automatically handles createdAt & updatedAt
);

export const Admin = mongoose.model<IAdminUser>("admin", adminSchema);
