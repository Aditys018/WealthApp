import express, { Router } from "express";
import multer, { FileFilterCallback } from "multer";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/");
	},
	filename: function (req, file, cb) {
		cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
	},
});

const fileFilter = (
	_: unknown,
	file: Express.Multer.File,
	cb: FileFilterCallback
) => {
	// reject a file
	if (
		file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/heic" ||
    file.mimetype === "application/pdf"
	) {
		cb(null, true);
	} else {
		cb(new Error("Invalid file type"));
	}
};

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 15,
	},
	fileFilter: fileFilter,
});

import {
	registerUser,
	loginUser,
	updateUserProfile,
	getUserProfile,
	uploadImages,
	getCountries,
	getCities,
	getPublicUserProfile,
	generateAndStoreDescription,
	verifyLoginOTP,
	resendOTP,
} from "../controller";
import { checkRole } from "../middlewares";

const router = Router();

// Create a wrapper function
const uploadMiddleware = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	upload.single("image")(req as any, res as any, (err) => {
		if (err) {
			if (err instanceof multer.MulterError) {
				// Handle Multer-specific errors
				if (err.code === "LIMIT_FILE_SIZE") {
					return res.status(400).json({
						success: false,
						message: "File size exceeds the limit of 15MB.",
					});
				}
			} else if (err.message === "Invalid file type") {
				// Handle custom file type errors
				return res.status(400).json({
					success: false,
					message:
            "Invalid file type. Only JPEG, PNG, and PDF files are allowed.",
				});
			} else {
				// Handle other errors
				return res.status(500).json({
					success: false,
					message: "An error occurred during file upload.",
					error: err.message,
				});
			}
		}
		next();
	});
};

// router.get("/", checkRole(["admin"]), (req, res) => {
//   res.json({ message: "Admin" });
// });

router.post("/register", checkRole(["ADMIN"]), registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyLoginOTP);
router.post("/resend-otp", resendOTP);
router.patch("/:id", updateUserProfile);
router.get("/:id", getUserProfile);
router.post("/upload", uploadMiddleware, uploadImages);
router.get("/countries/list", getCountries);
router.get("/cities/:countryCode", getCities);
router.get("/public/:id", getPublicUserProfile);
router.post(
	"/update-description",
	checkRole(["USER", "FREE_USER"]),
	generateAndStoreDescription
);

export default router;
