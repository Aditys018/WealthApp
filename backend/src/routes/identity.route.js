const Router = require("express").Router;
const {
  getAccessTokenFromRefreshToken,
  sendOtp
} = require("../controller/identity.controller");

const router = Router();

// router.get("/", checkRole(["admin"]), (req, res) => {
//   res.json({ message: "Admin" });
// });

router.post("/token", getAccessTokenFromRefreshToken);
router.post("/send-otp", sendOtp);

module.exports = router;
