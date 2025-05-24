const express = require("express");
const { Router } = require("express");
const multer = require("multer");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/");
	},
	filename: function (req, file, cb) {
		cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
	},
});

const fileFilter = (_, file, cb) => {
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

const {
	registerUser,
	loginUser,
	updateUserProfile,
	getUserProfile,
	uploadImages,
	verifyLoginOTP,
	resendOTP,
} = require("../controller");
const { checkRole } = require("../middlewares");

const router = Router();

// Create a wrapper function
const uploadMiddleware = (req, res, next) => {
	upload.single("image")(req, res, (err) => {
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
// router.patch("/:id", updateUserProfile);
router.get("/:id", getUserProfile);
router.post("/upload", uploadMiddleware, uploadImages);
// router.get("/public/:id", getPublicUserProfile);

module.exports = router;