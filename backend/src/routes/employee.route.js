"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var employee_controller_1 = require("../controller/employee.controller");
var middlewares_1 = require("../middlewares");
var router = (0, express_1.Router)();
// Employee onboarding routes - accessible to employees and company admins
var employeeRoles = ["EMPLOYEE", "COMPANY_ADMIN"];
// Password management
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
module.exports= router;
