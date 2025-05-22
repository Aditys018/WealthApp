import { Router } from "express";
const {
  getAccessTokenFromRefreshToken,
} = require("../controller/identity.controller");

const router = Router();

// router.get("/", checkRole(["admin"]), (req, res) => {
//   res.json({ message: "Admin" });
// });

router.post("/token", getAccessTokenFromRefreshToken);

export default router;
