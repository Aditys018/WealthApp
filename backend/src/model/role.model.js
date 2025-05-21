import mongoose from "mongoose";

export const Role = mongoose.model(
  "role",
  new mongoose.Schema({
    name: { type: String, required: true },
    id: { type: String, required: true },
    description: String,
    permissions: {
      canInviteEmployees: { type: Boolean, default: false },
      canManagePermissions: { type: Boolean, default: false },
      canViewStatistics: { type: Boolean, default: false },
      canRevokeAccess: { type: Boolean, default: false },
      canManageCompanyPreferences: { type: Boolean, default: false },
      canRegisterCompany: { type: Boolean, default: false },
    },
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() }
  }, { timestamps: true })
);
