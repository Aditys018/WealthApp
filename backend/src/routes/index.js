const { Router } = require("express");
// const adminRoutes = require("./admin.route");
const userRoutes = require("./user.route");
const identityRoutes = require("./identity.route");
const companyRoutes = require("./company.route");
const placesRoutes = require("./places.route");

const router = Router();

// router.use("/admin/", adminRoutes);
router.use("/user/", userRoutes);
router.use("/identity/", identityRoutes);
router.use("/companies/", companyRoutes);
router.use("/places/", placesRoutes);

module.exports = router;
