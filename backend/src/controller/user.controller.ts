import { Request, Response } from "express";
import Joi from "joi";
import bcrypt from "bcrypt";

import {
	UserProfile,
	Admin,
	mongoose,
	Country,
	City,
	PendingUserProfile,
} from "../model";
import { validateUserProfileCompletion, generateTokens } from "../utility";
import { IProfileSectionsWithDescription, IUserProfile } from "../types";
import { generateSummary } from "../utility/profileSummaryScheduler";

const registerSchema = Joi.object({
	role: Joi.string().valid("USER", "FREE_USER").required().label("Role"),
	email: Joi.string().email().required().label("Email"),
	firstName: Joi.string().required().label("First Name"),
	lastName: Joi.string().required().label("Last Name"),
	gender: Joi.string().required().valid("Male", "Female").label("Gender"),
	phoneNumber: Joi.string().required().label("Phone Number"),
	//if role is USER then only these fields are required
	invoiceNumbers: Joi.when("role", {
		is: "USER",
		then: Joi.array().items(Joi.string()).required(),
		otherwise: Joi.forbidden(),
	}),
	amount: Joi.when("role", {
		is: "USER",
		then: Joi.number().required(),
		otherwise: Joi.forbidden(),
	}),
	paymentDate: Joi.when("role", {
		is: "USER",
		then: Joi.number().required(),
		otherwise: Joi.forbidden(),
	}),
	noOfMatchesProposed: Joi.when("role", {
		is: "USER",
		then: Joi.number().required(),
		otherwise: Joi.forbidden(),
	}),
	matchmakerId: Joi.string().required().label("Matchmaker ID"),
	matchmakerName: Joi.string().required().label("Matchmaker Name"),
});

export const registerUser = async (req: Request, res: Response) => {
	try {
		const { error } = registerSchema.validate(req.body);
		if (error) return res.status(400).json({ error: error.details[0].message });

		const {
			firstName,
			lastName,
			email,
			gender,
			role,
			paymentDate,
			phoneNumber,
			noOfMatchesProposed,
			invoiceNumbers,
			amount,
			matchmakerName,
			matchmakerId,
		} = req.body;
		const password = Math.random().toString(36).slice(-8);
		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = new UserProfile({
			basicDetails: {
				firstName,
				lastName,
				email,
				gender,
				phoneNumber,
				role,
			},
			paymentDetails: {
				invoiceNumbers,
				amount,
				paymentDate,
				noOfMatchesProposed,
			},
			authentication: {
				username: email,
				password: hashedPassword,
				isPasswordResetRequired: true,
			},
			matchmaker: {
				matchmakerName,
				matchmakerId,
			},
		});

		// also get the match maker object and update the
		// array with the new user id
		const matchmaker = await Admin.findByIdAndUpdate(
			matchmakerId,
			{ $push: { undertakingUser: newUser._id } },
			{ new: true }
		);
		if (!matchmaker) {
			return res.status(404).json({ message: "Matchmaker not found" });
		}
		await newUser.save();

		res.status(201).json({
			message: "User registered",
			data: { email, password, user: newUser },
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const loginUser = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		const user = await UserProfile.findOne({ "basicDetails.email": email });
		if (!user)
			return res.status(404).json({
				message:
          "You do not seem to have an account with us. Click on Get Started button if you'd like to work with us.",
			});

		const isPasswordValid = await bcrypt.compare(
			password,
			user.authentication.password
		);
		if (!isPasswordValid)
			return res
				.status(401)
				.json({ message: "Your Password seems to be incorrect" });

		const tokens = generateTokens(
			user._id.toString(),
			user.basicDetails.firstName,
			[user.basicDetails.role]
		);
		res.json({
			message: "Login successful",
			status: true,
			data: { tokens, user },
		});
	} catch (err) {
		res.status(500).json({
			error: err.message,
			status: false,
			message: "Login failed",
			description: err.message,
		});
	}
};

//route to get user profile is /user/:id
// add joi validation for the id
export const getUserProfile = async (req: Request, res: Response) => {
	try {
		const { error } = Joi.string().length(24).validate(req.params.id);

		if (error)
			return res.status(400).json({
				error: error.details[0].message,
				status: false,
				message: "Invalid user ID",
			});

		const user = await UserProfile.findById(req.params.id);
		if (!user) return res.status(404).json({ message: "User not found" });

		// send everything except the authentication object
		user.authentication = undefined;
		console.log("user", user);
		res.status(200).json({ data: user, status: true, message: "User details" });
	} catch (err) {
		res.status(500).json({
			error: err.message,
			status: true,
			message: "User details fetch failed",
			description: err.message,
		});
	}
};

export const uploadImages = (req: Request, res: Response) => {
	console.log("nananan🆔", req.file);
	if (!req.file) {
		return res
			.status(400)
			.json({ error: "No file uploaded or invalid file type." });
	}

	console.log(req.file);
	res.json({
		message: "File uploaded successfully",
		link: `${process.env.HOST_NAME}/${req.file.path}`,
	});
};

const restrictedFields = ["basicDetails.email", "basicDetails.phoneNumber"];

// Define the update schema with allowed fields
const updateUserProfileSchema = Joi.object({
	_id: Joi.string(),
	basicDetails: Joi.object({
		firstName: Joi.string(),
		lastName: Joi.string(),
		gender: Joi.string().valid("Male", "Female"),
		birthday: Joi.string(),
		currentCountry: Joi.string(),
		currentCity: Joi.string(),
		currentCountryCode: Joi.string(),
		hometown: Joi.string(),
		hometownCountry: Joi.string(),
		hometownCountryCode: Joi.string(),
		height: Joi.number(),
		role: Joi.string(),
		description: Joi.string().allow(""),
	}).unknown(false),
	workAndEducation: Joi.object({
		undergraduateCollege: Joi.string().allow(""),
		undergraduateDegree: Joi.string().allow(""),
		postgraduateCollege: Joi.string().allow(""),
		postgraduateDegree: Joi.string().allow(""),
		professionalStatus: Joi.string().allow(""),
		currentCompany: Joi.string().allow(""),
		designation: Joi.string().allow(""),
		annualIncome: Joi.number(),
		description: Joi.string().allow(""),
	}).unknown(false),
	background: Joi.object({
		maritalStatus: Joi.string(),
		parentsLocation: Joi.string().allow(""),
		language: Joi.array().items(Joi.string()),
		numberOfSiblings: Joi.number(),
		caste: Joi.string().allow(""),
		fatherOccupation: Joi.string().allow(""),
		motherOccupation: Joi.string().allow(""),
		religion: Joi.string().allow(""),
		briefAboutFamily: Joi.string().allow(""),
		description: Joi.string().allow(""),
	}).unknown(false),
	lifestyleAndPersonality: Joi.object({
		dietaryPreference: Joi.string(),
		drinkingHabits: Joi.string(),
		smokingHabits: Joi.string(),
		politicalViews: Joi.string(),
		religiousViews: Joi.string(),
		stayWithParents: Joi.string().valid("Yes", "No"),
		hobbies: Joi.string().allow(""),
		personalGoals: Joi.string().allow(""),
		bodyType: Joi.string().valid("Slim", "Athletic", "Average", "Heavy"),
		workout: Joi.string().valid(
			"Hits the Gym Daily",
			"Works Out Occasionally",
			"Plays sports Occasionally",
			"Aerobic Activities",
			"Flexibility Activities",
			"Not into Fitness"
		),
		foodPreferences: Joi.string().valid(
			"Vegetarian",
			"Non-Vegetarian",
			"Eggetarian",
			"Vegan"
		),
		description: Joi.string().allow(""),
	}).unknown(false),
	partnerPreferences: Joi.object({
		lookForInPartner: Joi.string().allow(""),
		partnerConstraints: Joi.array().items(Joi.string()),
		childrenViews: Joi.string(),
		openToRelocate: Joi.string().valid("Yes", "No"),
		openToPets: Joi.string().valid("Yes", "No"),
		description: Joi.string().allow(""),
	}).unknown(false),
	profilePictures: Joi.array().items(Joi.string()),
	documents: Joi.array().items(
		Joi.object({
			name: Joi.string(),
			url: Joi.string(),
		})
	),
}).unknown(false);

/**
 * Route to update user profile
 * @param req - Express request object
 * @param res - Express response object
 * @returns JSON response with success status and updated user profile
 * @throws 400 - Bad request if validation fails
 * @throws 404 - Not found if user profile does not exist
 * @throws 500 - Internal server error if update fails
 * @description This route updates the user profile based on the provided user ID and update data.
 */
export const updateUserProfile = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		// Validate userId format
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({
				success: false,
				message: "Invalid user ID format",
			});
		}

		// Get update data from request body
		const updateData = req.body;

		// If no update data is provided, return error
		if (!updateData || Object.keys(updateData).length === 0) {
			return res.status(400).json({
				success: false,
				message: "No update data provided",
			});
		}

		// Validate the update data against the schema
		const { error, value } = updateUserProfileSchema.validate(updateData, {
			abortEarly: false,
			stripUnknown: true,
		});

		if (error) {
			return res.status(400).json({
				success: false,
				message: "Validation error",
				errors: error.details.map((detail) => ({
					field: detail.path.join("."),
					message: detail.message,
				})),
			});
		}

		// Create a flattened update object for nested fields
		const flattenedUpdate: Record<string, any> = {};

		// Helper function to flatten nested objects with dot notation
		const flattenObject = (obj: Record<string, any>, prefix = "") => {
			// Check if object is defined before flattening
			if (!obj) {
				console.error("Object is undefined");
				return;
			}

			for (const key in obj) {
				const newKey = prefix ? `${prefix}.${key}` : key;

				// If the value is an object but not an array, flatten it further
				if (
					typeof obj[key] === "object" &&
          !Array.isArray(obj[key]) &&
          obj[key] !== null
				) {
					flattenObject(obj[key], newKey);
				} else {
					// Otherwise set the value directly with the dotted path
					flattenedUpdate[newKey] = obj[key];
				}
			}
		};

		// Flatten the validated update 📊
		flattenObject(value);

		// Determine the formStage based on completed sections
		let formStage = "BASIC_DETAILS";

		if (value.workAndEducation) {
			formStage = "WORK_AND_EDUCATION";
		}
		if (value.background) {
			formStage = "BACKGROUND";
		}
		if (value.lifestyleAndPersonality) {
			formStage = "LIFESTYLE_AND_PERSONALITY";
		}
		if (value.partnerPreferences) {
			formStage = "PARTNER_PREFERENCES";
		}
		if (value.profilePictures && value.profilePictures.length === 4) {
			formStage = "PROFILE_PICTURES";
		}
		if (value.documents && value.documents.length > 0) {
			formStage = "DOCUMENTS";
		}

		flattenedUpdate["formStage"] = formStage;

		const updatedProfile = (await UserProfile.findByIdAndUpdate(
			id,
			{ $set: flattenedUpdate },
			{ new: true, runValidators: true }
		)) as IUserProfile;

		const isDetailsFilled = validateUserProfileCompletion(updatedProfile);

		const isProfileComplete =
      isDetailsFilled &&
      updatedProfile.documents.length >= 3 &&
      updatedProfile.profilePictures.length >= 4;

		if (
			isDetailsFilled &&
      updatedProfile.profileStage === "INCOMPLETE_INFORMATION"
		) {
			console.log("Profile is complete, updating profile stage..✅.", {
				firstName: updatedProfile?.basicDetails?.firstName || "",
				lastName: updatedProfile?.basicDetails?.lastName || "",
				value,
			});
			const isPendingUserProfileExists = await PendingUserProfile.findOne({
				id: id,
			});
			if (!isPendingUserProfileExists) {
				await PendingUserProfile.create({
					name:
            updatedProfile?.basicDetails?.firstName +
            " " +
            updatedProfile?.basicDetails?.lastName,
					id: id,
					isPending: true,
					pendingSections: [
						IProfileSectionsWithDescription.basicDetails,
						IProfileSectionsWithDescription.workAndEducation,
						IProfileSectionsWithDescription.background,
						IProfileSectionsWithDescription.lifestyleAndPersonality,
						IProfileSectionsWithDescription.partnerPreferences,
					],
				});
			}
		}

		// Update the profile stage if the profile is complete
		if (
			(isProfileComplete && updatedProfile.profileStage === "INCOMPLETE_INFORMATION")
		) {
			console.log("Profile is complete, updating profile stage..❌.");

			// Update the profile stage in the user profile
			await UserProfile.findByIdAndUpdate(
				id,
				{ $set: { profileStage: "UNDER_REVIEW" } },
				{ new: true, runValidators: true }
			);
		}

		// If the update fails, return error
		if (!updatedProfile) {
			return res.status(500).json({
				success: false,
				message: "Failed to update user profile",
			});
		}

		// Check if user exists
		if (!updatedProfile) {
			return res.status(404).json({
				success: false,
				message: "User profile not found",
			});
		}

		return res.status(200).json({
			success: true,
			message: "User profile updated successfully",
			data: updatedProfile,
		});
	} catch (error: any) {
		console.error("Error updating user profile:", error);
		// Handle validation errors
		if (error.name === "ValidationError") {
			return res.status(400).json({
				success: false,
				message: "Validation error",
				errors: error.errors,
			});
		}

		// Handle duplicate key errors (e.g., email)
		if (error.code === 11000) {
			return res.status(400).json({
				success: false,
				message: "Duplicate key error",
				error: error.keyValue,
			});
		}

		return res.status(500).json({
			success: false,
			message: "Failed to update user profile",
			error: error.message,
		});
	}
};

export const getCountries = async (req: Request, res: Response) => {
	try {
		const searchQuery = req.query.search as string;

		let query = {};
		if (searchQuery) {
			// Create a case-insensitive regex search for country name
			query = {
				$or: [
					{ name: { $regex: searchQuery, $options: "i" } },
					{ capital: { $regex: searchQuery, $options: "i" } },
					{ iso2: { $regex: searchQuery, $options: "i" } },
					{ iso3: { $regex: searchQuery, $options: "i" } },
				],
			};
		}

		const countries = await Country.find(query).sort({ name: 1 });

		res.status(200).json({
			status: true,
			message: "Countries fetched successfully",
			data: countries,
			count: countries.length,
		});
	} catch (err) {
		res.status(500).json({
			status: false,
			message: "Failed to fetch countries",
			error: err.message,
		});
	}
};

export const getCities = async (req: Request, res: Response) => {
	try {
		const { countryCode } = req.params;
		const searchQuery = req.query.search as string;

		// Validate countryCode
		if (!countryCode) {
			return res.status(400).json({
				status: false,
				message: "Country code is required",
			});
		}

		const query: any = { countryCode };

		if (searchQuery) {
			// Add search condition to the existing query
			query.name = { $regex: searchQuery, $options: "i" };
		}

		const cities = await City.find(query).sort({ name: 1 });

		res.status(200).json({
			status: true,
			message: "Cities fetched successfully",
			data: cities,
			count: cities.length,
		});
	} catch (err) {
		res.status(500).json({
			status: false,
			message: "Failed to fetch cities",
			error: err.message,
		});
	}
};

/**
 * fetch only public relevant user profile
 */
export const getPublicUserProfile = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const idSchema = Joi.string().length(24).hex().required();
		const { error } = idSchema.validate(id);
		if (error) {
			return res.status(400).json({ error: "Invalid user ID format" });
		}

		const user = await UserProfile.findById(id);

		if (!user) {
			return res.status(404).json({
				status: false,
				message: "User not found",
			});
		}

		const filteredProfile = {
			birthday: user.basicDetails?.birthday || "",
			currentCity: user.basicDetails?.currentCity || "",
			height: user.basicDetails?.height ?? null,
			firstName: user.basicDetails?.firstName || "",
			hometown: user.basicDetails?.hometown || "",
			language: user.background?.language || [],
			maritalStatus: user.background?.maritalStatus || "",
			religion: user.background?.religion || "",
			numberOfSiblings: user.background?.numberOfSiblings ?? null,
			annualIncome: user.workAndEducation?.annualIncome ?? null,
			stayWithParents: user.lifestyleAndPersonality?.stayWithParents || "",
			smokingHabits: user.lifestyleAndPersonality?.smokingHabits || "",
			drinkingHabits: user.lifestyleAndPersonality?.drinkingHabits || "",
			postGradDegree: user.workAndEducation?.postgraduateDegree || "",
			gradDegree: user.workAndEducation?.undergraduateDegree || "",
			workout: user.lifestyleAndPersonality?.workout || "",
			foodPreferences: user.lifestyleAndPersonality?.foodPreferences || "",
			religiousViews: user.lifestyleAndPersonality?.religiousViews || "",
			childrenViews: user.partnerPreferences?.childrenViews || "",
			lookForInPartner: user.partnerPreferences?.lookForInPartner || "",
			openToPets: user.partnerPreferences?.openToPets || "",
			openToRelocate: user.partnerPreferences?.openToRelocate || "",
			profilePictures: user.profilePictures || [],
			gender: user.basicDetails?.gender || "",
			basicDescription:
        user.basicDetails?.description ||
        user.basicDetails?.overallSummary ||
        "",
			workAndEducationDescription: user.workAndEducation?.description || "",
			backgroundDescription: user.background?.description || "",
			lifestyleAndPersonalityDescription:
        user.lifestyleAndPersonality?.description || "",
			partnerPreferencesDescription: user.partnerPreferences?.description || "",
			designation: user.workAndEducation?.designation || "",
		};

		res.status(200).json({
			status: true,
			message: "User details fetched successfully",
			data: filteredProfile,
		});
	} catch (err) {
		res.status(500).json({
			status: false,
			message: "Failed to fetch user details",
			error: err.message,
		});
	}
};

interface IGenerateDescriptionRequestBody {
  userId: string;
  sections: IProfileSectionsWithDescription[];
}

export const generateAndStoreDescription = async (
	req: Request,
	res: Response
) => {
	try {
		const { userId, sections } = req.body as IGenerateDescriptionRequestBody;

		if (!userId || !sections || !Array.isArray(sections)) {
			return res.status(400).json({
				success: false,
				message: "Invalid request. 'userId' and 'sections' are required.",
			});
		}

		const user = await UserProfile.findById(userId);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found.",
			});
		}

		for (const section of sections) {
			if (!user[section]) {
				console.warn(`Section '${section}' not found in user profile.`);
				continue;
			}

			const content = JSON.stringify(user[section]);
			const summary = await generateSummary(section, content);

			if (summary) {
				user[section].description = summary;
				console.log(`Generated and stored description for section: ${section}`);
			} else {
				console.warn(`Failed to generate description for section: ${section}`);
			}
		}

		await user.save();

		res.status(200).json({
			success: true,
			message: "Descriptions generated and stored successfully.",
			data: user,
		});
	} catch (error) {
		console.error("Error generating and storing descriptions:", error);
		res.status(500).json({
			success: false,
			message: "Failed to generate and store descriptions.",
			error: error.message,
		});
	}
};
