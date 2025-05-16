import { Router } from "express";

import {
  getAccessTokenFromRefreshToken
} from "../controller";

const router = Router();

// router.get("/", checkRole(["admin"]), (req, res) => {
//   res.json({ message: "Admin" });
// });

router.post("/token", getAccessTokenFromRefreshToken);

export default router;
