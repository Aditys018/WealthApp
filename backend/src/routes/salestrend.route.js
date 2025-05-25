// routes/salesTrendRoutes.js
const Router = require("express").Router;
const { getSalesTrend } = require("../controller/salesTrendController");

const router = Router();

router.get("/salestrend", getSalesTrend);

module.exports = router;
