import { Router } from "express";

import { 
  changePassword,
  setupMFA,
  acceptTermsOfService,
  updateTutorialProgress,
  updateNotificationPreferences,
  getOnboardingStatus
} from "../controller/employee.controller";
import { checkRole } from "../middlewares";

const router = Router();

// Employee onboarding routes - accessible to employees and company admins
const employeeRoles = ["EMPLOYEE", "COMPANY_ADMIN"];

// Password management
router.post("/change-password", checkRole(employeeRoles), changePassword);

// // Multi-factor authentication
// router.post("/mfa/setup", checkRole(employeeRoles), setupMFA);

// // Terms of service
// router.post("/terms/accept", checkRole(employeeRoles), acceptTermsOfService);

// // Onboarding tutorial
// router.post("/tutorial/progress", checkRole(employeeRoles), updateTutorialProgress);

// // Notification preferences
// router.post("/notifications/preferences", checkRole(employeeRoles), updateNotificationPreferences);

// // Get onboarding status
// router.get("/onboarding/status", checkRole(employeeRoles), getOnboardingStatus);

export default router;