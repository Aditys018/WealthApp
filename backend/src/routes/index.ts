import { Router } from "express";
import adminRoutes from "./admin.route";
import userRoutes from "./user.route";
import identityRoutes from "./identity.route";

const router = Router();

router.use("/admin/", adminRoutes);
router.use("/user/", userRoutes);
router.use("/identity/", identityRoutes);

export default router;

