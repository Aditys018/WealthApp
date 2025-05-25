const Router = require("express").Router;
const {
    propertyList
} = require("../controller");

const router = Router();

// router.get("/", checkRole(["admin"]), (req, res) => {
//   res.json({ message: "Admin" });
// });

router.get("/list-properties", propertyList);

module.exports = router;
