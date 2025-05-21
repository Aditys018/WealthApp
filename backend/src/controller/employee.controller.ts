import { Request, Response } from "express";
import joi from "joi";
import bcrypt from "bcrypt";

import { UserProfile } from "../model";
import { validatePasswordComprehensive } from "../utility/passwordUtility";
import { createAndSendOTP } from "../utility/mailUtility";


/**
 * Change password for an employee (required on first login)
 * @param req
 * @param res
 */
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = "req?.user?.id";
    const { currentPassword, newPassword } = req.body;

    // Validate request body
    const schema = joi.object({
      currentPassword: joi.string().required(),
      newPassword: joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Find the user
    const user = await UserProfile.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Validate new password
    const passwordValidation = validatePasswordComprehensive(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ message: passwordValidation.message });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password and reset requirement flag
    user.password = hashedPassword;
    user.passwordResetRequired = false;
    await user.save();

    return res.status(200).json({
      message: "Password changed successfully",
      data: {
        passwordResetRequired: false,
      },
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res
      .status(500)
      .json({ message: "Error changing password", error: error.message });
  }
};

/**
 * Setup multi-factor authentication for an employee
 * @param req
 * @param res
 */
export const setupMFA = async (req: Request, res: Response) => {
  try {
    const userId = "req.user?.id";
    const { enable } = req.body;

    // Validate request body
    const schema = joi.object({
      enable: joi.boolean().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Find the user
    const user = await UserProfile.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update MFA setting
    user.mfaEnabled = enable;
    await user.save();

    // If enabling MFA, send an OTP to verify
    if (enable) {
      const { otp, expiresAt } = await createAndSendOTP(
        user.email,
        user.firstName || user.email.split("@")[0]
      );

      // Store OTP in user record
      user.otp = {
        code: otp,
        expiresAt,
        verified: false,
      };
      await user.save();

      return res.status(200).json({
        message:
          "MFA setup initiated. Please verify with the OTP sent to your email.",
        data: {
          mfaEnabled: true,
          requiresVerification: true,
          otpExpiresAt: expiresAt,
        },
      });
    }

    return res.status(200).json({
      message: "MFA settings updated successfully",
      data: {
        mfaEnabled: enable,
      },
    });
  } catch (error) {
    console.error("Error setting up MFA:", error);
    return res
      .status(500)
      .json({ message: "Error setting up MFA", error: error.message });
  }
};

/**
 * Accept terms of service
 * @param req
 * @param res
 */
export const acceptTermsOfService = async (req: Request, res: Response) => {
  try {
    const userId = "req.user.id";
    const { version } = req.body;

    // Validate request body
    const schema = joi.object({
      version: joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Find the user
    const user = await UserProfile.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update terms of service acceptance
    user.termsOfService = {
      accepted: true,
      acceptedAt: new Date(),
      version,
    };
    await user.save();

    return res.status(200).json({
      message: "Terms of service accepted successfully",
      data: {
        termsOfService: user.termsOfService,
      },
    });
  } catch (error) {
    console.error("Error accepting terms of service:", error);
    return res.status(500).json({
      message: "Error accepting terms of service",
      error: error.message,
    });
  }
};

interface ITutorialProgressRequestBody {
  user: {
    id: string;
  };
  step: string;
  completed: boolean;
}

/**
 * Update onboarding tutorial progress
 * @param req
 * @param res
 */
export const updateTutorialProgress = async (
  req: Request<{}, {}, ITutorialProgressRequestBody>,
  res: Response
) => {
  try {
    const userId = req.body.user.id;
    const { step, completed } = req.body;

    // Validate request body
    const schema = joi.object({
      step: joi.string().required(),
      completed: joi.boolean().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Find the user
    const user = await UserProfile.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize onboarding if it doesn't exist
    if (!user.onboarding) {
      user.onboarding = {
        tutorialCompleted: false,
        completedSteps: [],
      };
    }

    // Update tutorial progress
    if (completed) {
      // Add step to completed steps if not already there
      if (!user.onboarding.completedSteps.includes(step)) {
        user.onboarding.completedSteps.push(step);
      }
      user.onboarding.lastCompletedStep = step;
    } else {
      // Remove step from completed steps
      user.onboarding.completedSteps = user.onboarding.completedSteps.filter(
        (s) => s !== step
      );
    }

    // Check if all required steps are completed
    const requiredSteps = [
      "welcome",
      "profile",
      "security",
      "notifications",
      "features",
    ];
    const allStepsCompleted = requiredSteps.every((s) =>
      user.onboarding.completedSteps.includes(s)
    );

    if (allStepsCompleted) {
      user.onboarding.tutorialCompleted = true;
      user.onboarding.completedAt = new Date();
    } else {
      user.onboarding.tutorialCompleted = false;
      user.onboarding.completedAt = undefined;
    }

    await user.save();

    return res.status(200).json({
      message: "Tutorial progress updated successfully",
      data: {
        onboarding: user.onboarding,
      },
    });
  } catch (error) {
    console.error("Error updating tutorial progress:", error);
    return res.status(500).json({
      message: "Error updating tutorial progress",
      error: error.message,
    });
  }
};
interface INotificationPreferencesRequestBody {
  user: {
    id: string;
  };
  preferences: {
    email?: boolean;
    inApp?: boolean;
    marketing?: boolean;
    updates?: boolean;
  };
}
/**
 * Update notification preferences
 * @param req
 * @param res
 */
export const updateNotificationPreferences = async (
  req: Request<{}, {}, INotificationPreferencesRequestBody>,
  res: Response
) => {
  try {
    const userId = req.body.user.id;
    const { preferences } = req.body;

    // Validate request body
    const schema = joi.object({
      preferences: joi
        .object({
          email: joi.boolean().optional(),
          inApp: joi.boolean().optional(),
          marketing: joi.boolean().optional(),
          updates: joi.boolean().optional(),
        })
        .required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Find the user
    const user = await UserProfile.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize notification preferences if they don't exist
    if (!user.notificationPreferences) {
      user.notificationPreferences = {
        email: true,
        inApp: true,
        marketing: false,
        updates: true,
      };
    }

    // Update notification preferences
    user.notificationPreferences = {
      ...user.notificationPreferences,
      ...preferences,
    };
    await user.save();

    return res.status(200).json({
      message: "Notification preferences updated successfully",
      data: {
        notificationPreferences: user.notificationPreferences,
      },
    });
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    return res.status(500).json({
      message: "Error updating notification preferences",
      error: error.message,
    });
  }
};

interface IOnboardingStatus {
  user: {
    id: string;
  };
}
/**
 * Get employee onboarding status
 * @param req
 * @param res
 */
export const getOnboardingStatus = async (
  req: Request<{}, {}, { user: { id: string } }, {}, { user: { id: string } }>,
  res: Response
) => {
  try {
    const userId = req?.body.user?.id || "";

    // Find the user
    const user = await UserProfile.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compile onboarding status
    const onboardingStatus = {
      passwordResetRequired: user.passwordResetRequired || false,
      mfaEnabled: user.mfaEnabled || false,
      termsAccepted: user.termsOfService?.accepted || false,
      tutorialCompleted: user.onboarding?.tutorialCompleted || false,
      notificationPreferencesSet: !!user.notificationPreferences,
      completedSteps: user.onboarding?.completedSteps || [],
      lastCompletedStep: user.onboarding?.lastCompletedStep,
    };

    return res.status(200).json({
      message: "Onboarding status retrieved successfully",
      data: onboardingStatus,
    });
  } catch (error) {
    console.error("Error getting onboarding status:", error);
    return res.status(500).json({
      message: "Error getting onboarding status",
      error: error.message,
    });
  }
};
