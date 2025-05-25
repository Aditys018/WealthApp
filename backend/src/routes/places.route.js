const Router = require("express").Router;
const {
    propertyList,
    propertyDetails
} = require("../controller");

const router = Router();

// router.get("/", checkRole(["admin"]), (req, res) => {
//   res.json({ message: "Admin" });
// });

router.get("/list-properties", propertyList);
router.get("/property/:id", propertyDetails); // Assuming you want to get a specific property by ID

module.exports = router;
