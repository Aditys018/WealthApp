const { Router } = require("express");
// const adminRoutes = require("./admin.route");
const userRoutes = require("./user.route");
const identityRoutes = require("./identity.route");
const companyRoutes = require("./company.route");
const employeeRoutes = require("./employee.route");
const placesRoutes = require("./places.route");
const { log } = require("../middlewares");

const router = Router();

// router.use("/admin/", adminRoutes);
router.use("/user/", log, userRoutes);
router.use("/identity/", log, identityRoutes);
router.use("/companies/", log, companyRoutes);
router.use("/employee/", log, employeeRoutes);
router.use("/places/", log, placesRoutes);

module.exports = router;