"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var body_parser_1 = require("body-parser");
require("dotenv/config");
var cors_1 = require("cors");
var path_1 = require("path");
var db = require("./model");
var routes_1 = require("./routes");
var app = (0, express_1.default)();
var json = body_parser_1.default.json, urlencoded = body_parser_1.default.urlencoded;
var PORT = 8080;
var DB_URL = process.env.DB_HOST ||
    "mongodb+srv://divyansh0908:rxAxc38ppfBBNzrh@sandbox.vwhnx.mongodb.net/?retryWrites=true&w=majority&appName=Sandbox";
// Serve uploads folder publicly
app.use("/uploads", express_1.default.static(path_1.default.join(path_1.default.dirname(""), "uploads")));
db.mongoose
    .connect(DB_URL, {
    dbName: "wealth-map",
    useBigInt64: true,
})
    .then(function () {
    console.log("Connected to the database!");
    // initial();
})
    .catch(function (err) {
    console.log("Cannot connect to the database!", err);
    process.exit();
});
app.get("/ping", function (req, res) {
    res.json({ greeting: "Server Is In Good Health!" });
});
app.listen(PORT, function () {
    console.log("\uD83D\uDE80 server started at http://localhost:".concat(PORT));
});
// const Role = db.Role;
app.use(json());
app.use((0, cors_1.default)());
app.use(urlencoded({ extended: true }));
app.use("/", routes_1.default);
// app.use((req, res) => {
// res.writeHead(200, { "Content-Type": "text/plain" });
// res.end("../frontend/dist/index.html");
// /**
//  * Check if all the Roles in `Roles` object are present in the database, if not then add them
//  * @returns void
//  * @async
//  * @writtenBY: Divyansh Anand
//  * @lastModifiedBy: Divyansh Anand
//  */
// async function initial() {
// 	const allRoles = Object.keys(Roles);
// 	const roles = await Role.find();
// 	// check if all items inside allRoles is present as ids of roles, and which are not present add them to missingRoles
// 	const missingRoles = allRoles.filter(
// 		(role) => !roles.find((r) => r.id === role)
// 	);
// 	console.log("Missing Roles: ", missingRoles);
// 	Role.insertMany(
// 		missingRoles.map((role) => {
// 			return {
// 				name: role,
// 				id: role,
// 			};
// 		})
// 	).then(() => {
// 		console.log("Roles added successfully");
// 	});
// }
