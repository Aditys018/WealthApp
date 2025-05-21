"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var controller_1 = require("../controller");
var router = (0, express_1.Router)();
// // Company management routes
router.post("/register", controller_1.registerCompany); // Allow any authenticated user to register a company
// // router.get("/", checkRole(["ADMIN", "COMPANY_ADMIN"]), getAdminCompanies);
// router.get("/:id", checkRole(["ADMIN", "COMPANY_ADMIN"]), getCompanyById);
// router.put("/:id", checkRole(["ADMIN", "COMPANY_ADMIN"]), updateCompany);
// router.put("/:id/preferences", checkRole(["ADMIN", "COMPANY_ADMIN"]), updateCompanyPreferences);
// // Employee management routes
// router.post("/:companyId/employees/invite", checkRole(["ADMIN", "COMPANY_ADMIN"]), inviteEmployee);
// router.get("/:companyId/employees", checkRole(["ADMIN", "COMPANY_ADMIN"]), getCompanyEmployees);
// router.put("/:companyId/employees/:employeeId/permissions", checkRole(["ADMIN", "COMPANY_ADMIN"]), updateEmployeePermissions);
// router.post("/:companyId/employees/:employeeId/activity", checkRole(["ADMIN", "COMPANY_ADMIN"]), trackEmployeeActivity);
// router.get("/:companyId/employees/statistics", checkRole(["ADMIN", "COMPANY_ADMIN"]), getEmployeeStatistics);
// router.delete("/:companyId/employees/:employeeId", checkRole(["ADMIN", "COMPANY_ADMIN"]), revokeEmployeeAccess);
exports.default = router;
