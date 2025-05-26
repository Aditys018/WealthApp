const Router = require("express").Router;
const {
  propertyList,
  propertyDetails,
  getPropertyTypes,
} = require("../controller");
const { checkRole, log } = require("../middlewares");

const router = Router();

router.get("/list-properties", checkRole(["ADMIN", "COMPANY_ADMIN", "EMPLOYEE"]), log, propertyList);
router.get("/property/:id", checkRole(["ADMIN", "COMPANY_ADMIN", "EMPLOYEE"]), log, propertyDetails); // Assuming you want to get a specific property by ID
router.get("/property-types", checkRole(["ADMIN", "COMPANY_ADMIN", "EMPLOYEE"]), log, getPropertyTypes);

module.exports = router;
