const Router = require("express").Router;
const {
  getAccessTokenFromRefreshToken,
  sendOtp,
} = require("../controller/identity.controller");
const { log } = require("../middlewares");

const router = Router();

// router.get("/", checkRole(["admin"]), (req, res) => {
//   res.json({ message: "Admin" });
// });

router.post("/token", log, getAccessTokenFromRefreshToken);
router.post("/send-otp", log, sendOtp);

module.exports = router;
