import express, { Request, Response } from "express";
import pkg from "body-parser";
import "dotenv/config";
import cors from "cors";
import path from "path";

import * as db from "./model";
import routes from "./routes";
import { Roles } from "./config";
import { scheduleUserDescriptionUpdate } from './utility'

const app = express();

const { json, urlencoded } = pkg;

const PORT = 8080;
const DB_URL =
  process.env.DB_HOST ||
  "mongodb+srv://divyansh0908:rxAxc38ppfBBNzrh@sandbox.vwhnx.mongodb.net/?retryWrites=true&w=majority&appName=Sandbox";
// Serve uploads folder publicly
app.use("/uploads", express.static(path.join(path.dirname(""), "uploads")));

db.mongoose
	.connect(DB_URL, {
		dbName: "the_date_crew",
		useBigInt64: true,
	})
	.then(() => {
		console.log("Connected to the database!");
		initial();
		scheduleUserDescriptionUpdate();
	})
	.catch((err) => {
		console.log("Cannot connect to the database!", err);
		process.exit();
	});

app.get("/ping", (req: Request, res: Response) => {
	res.json({ greeting: "Server Is In Good Health!" });
});

app.listen(PORT, () => {
	console.log(
		`🚀 server started at http://localhost:${PORT}, ${process.env.JWT_TOKEN_SECRET}`
	);
});

const Role = db.Role;

app.use(json());
app.use(cors());
app.use(urlencoded({ extended: true }));
app.use("/tdc/", routes);

// app.use((req, res) => {
// res.writeHead(200, { "Content-Type": "text/plain" });
// res.end("../frontend/dist/index.html");

/**
 * Check if all the Roles in `Roles` object are present in the database, if not then add them
 * @returns void
 * @async
 * @writtenBY: Divyansh Anand
 * @lastModifiedBy: Divyansh Anand
 */
async function initial() {
	const allRoles = Object.keys(Roles);
	const roles = await Role.find();

	// check if all items inside allRoles is present as ids of roles, and which are not present add them to missingRoles
	const missingRoles = allRoles.filter(
		(role) => !roles.find((r) => r.id === role)
	);
	console.log("Missing Roles: ", missingRoles);
	Role.insertMany(
		missingRoles.map((role) => {
			return {
				name: role,
				id: role,
			};
		})
	).then(() => {
		console.log("Roles added successfully");
	});
}
