import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        gender: {type: String, enum: ["Male", "Female"]},
        birthday: String,
        country: String,
        city: String,
        email: {type: String, unique: true},
        role: {type: String, enum: ["USER", "ADMIN", "EMPLOYEE", "COMPANY_ADMIN"], required: true},
        password: String,
        passwordResetRequired: {type: Boolean, default: false},
        otp: {
            code: String,
            expiresAt: Date,
            verified: {type: Boolean, default: false}
        },
        mfaEnabled: {type: Boolean, default: false},
        termsOfService: {
            accepted: {type: Boolean, default: false},
            acceptedAt: Date,
            version: String
        },
        onboarding: {
            tutorialCompleted: {type: Boolean, default: false},
            completedSteps: [String],
            lastCompletedStep: String,
            completedAt: Date
        },
        notificationPreferences: {
            email: {type: Boolean, default: true},
            inApp: {type: Boolean, default: true},
            marketing: {type: Boolean, default: false},
            updates: {type: Boolean, default: true}
        },
        company: {
            companyId: {type: mongoose.Schema.Types.ObjectId, ref: "company"},
            companyName: String,
            department: String,
            position: String,
            permissions: {
                canInviteEmployees: {type: Boolean, default: false},
                canManagePermissions: {type: Boolean, default: false},
                canViewStatistics: {type: Boolean, default: false},
                canRevokeAccess: {type: Boolean, default: false},
                canManageCompanyPreferences: {type: Boolean, default: false},
            },
            invitedBy: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
            invitationDate: Date,
            lastActivity: Date,
        },
        createdAt: {
            type: Date,
            default: () => new Date(),
        },
        updatedAt: {
            type: Date,
            default: () => new Date(),
        },
    },
    {timestamps: true}
);

export const UserProfile = mongoose.model("user", userProfileSchema);
