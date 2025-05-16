import { Router } from "express";

import { createAdmin, loginAdmin, getUndertakingUsers } from "../controller";
import { checkRole } from "../middlewares";

const router = Router();

// router.get("/", checkRole(["admin"]), (req, res) => {
//   res.json({ message: "Admin" });
// });

router.post("/register", checkRole(["ADMIN"]), createAdmin);
router.post("/login", loginAdmin);
router.get("/undertaking-users/:id", checkRole(["ADMIN"]), getUndertakingUsers);

export default router;
