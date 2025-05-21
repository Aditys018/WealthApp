import { Router } from "express";
// import adminRoutes from "./admin.route";
// import userRoutes from "./user.route";
// import identityRoutes from "./identity.route";
import companyRoutes from "./company.route";
import employeeRoutes from "./employee.route";

const router = Router();

// router.use("/admin/", adminRoutes);
// router.use("/user/", userRoutes);
// router.use("/identity/", identityRoutes);
router.use("/companies/", companyRoutes);
router.use("/employee/", employeeRoutes);

export default router;
