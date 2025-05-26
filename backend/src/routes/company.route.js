"use strict";
const { checkRole, log } = require("../middlewares");
const Router = require("express").Router;
var router = Router();
const {
  registerCompany,
  updateCompany,
  inviteEmployee,
  getCompanyEmployees,
  revokeEmployeeAccess,
  getEmployeeActivities,
} = require("../controller/company.controller");

router.post("/register", log, registerCompany); // Allow any authenticated user to register a company
router.put("/:id", checkRole(["ADMIN", "COMPANY_ADMIN"]), log, updateCompany);
router.post(
  "/:companyId/employees/invite",
  checkRole(["ADMIN", "COMPANY_ADMIN"]),
  log,
  inviteEmployee
);
router.get(
  "/:companyId/employees",
  checkRole(["ADMIN", "COMPANY_ADMIN"]),
  log,
  getCompanyEmployees
);
router.delete(
  "/:companyId/employees/:employeeId",
  checkRole(["ADMIN", "COMPANY_ADMIN"]),
  log,
  revokeEmployeeAccess
);
router.get(
  "/:companyId/employees/:employeeId/activities",
  checkRole(["ADMIN", "COMPANY_ADMIN"]),
  log,
  getEmployeeActivities
);

module.exports = router;
