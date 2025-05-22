const { Router } = require("express");
// const adminRoutes = require("./admin.route");
const userRoutes = require("./user.route");
const identityRoutes = require("./identity.route");
const companyRoutes = require("./company.route");
const employeeRoutes = require("./employee.route");

const router = Router();

// router.use("/admin/", adminRoutes);
router.use("/user/", userRoutes);
router.use("/identity/", identityRoutes);
router.use("/companies/", companyRoutes);
router.use("/employee/", employeeRoutes);

module.exports = router;