const Joi = require("joi");
const bcrypt = require("bcrypt");

const { UserProfile, Admin } = require("../model");
const { generateTokens } = require("../utility");
const {
  sendRegistrationEmail,
  createAndSendOTP,
  verifyOTP,
} = require("../utility/mailUtility");

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

const registerUser = async (req, res) => {
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

    // Send registration confirmation email
    try {
      await sendRegistrationEmail(email, firstName);
      console.log(`Registration confirmation email sent to ${email}`);
    } catch (emailError) {
      console.error(
        `Failed to send registration email to ${email}:`,
        emailError
      );
      // Continue with registration process even if email fails
    }

    res.status(201).json({
      message: "User registered",
      data: { email, password, user: newUser },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp, otpId } = req.body;

    // Find user by email
    const user = await UserProfile.findOne({ "email": email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: false,
      });
    }

    console.log("user", user);

    

    // Verify OTP
    const isOTPValid = verifyOTP(otp, otpId, email);
    if (!isOTPValid) {
      return res.status(401).json({
        message: "Invalid or expired OTP",
        status: false,
      });
    }

    // Generate tokens for authenticated user
    const tokens = generateTokens(user._id.toString(), user.firstName || "Admin", [
      user.role,
    ]);

    return res.status(200).json({
      message: "Login successful",
      status: true,
      data: { tokens, user },
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
      status: false,
      message: "OTP verification failed",
      description: err.message,
    });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await UserProfile.findOne({ "basicDetails.email": email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: false,
      });
    }

    // Generate and send new OTP
    const { otp, expiresAt } = await createAndSendOTP(email, user.firstName);

    // Update user with new OTP
    user.otp = {
      code: otp,
      expiresAt,
      verified: false,
    };
    await user.save();

    return res.status(200).json({
      message: "New OTP sent for verification",
      status: true,
      data: {
        email,
        requiresOTP: true,
      },
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
      status: false,
      message: "Failed to resend OTP",
      description: err.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("email", email);
    const user = await UserProfile.findOne({ "email": email });

    if (!user)
      return res.status(404).json({
        message:
          "You do not seem to have an account with us. Click on Get Started button if you'd like to work with us.",
      });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res
        .status(401)
        .json({ message: "Your Password seems to be incorrect" });

    // Generate and send OTP for login verification
    try {
      const { otp, expiresAt, id } = await createAndSendOTP(
        email,
        user.firstName
      );

      // Update user with OTP information
      user.otp = {
        code: otp,
        expiresAt,
        verified: false,
      };

      return res.status(200).json({
        message: "OTP sent for verification",
        status: true,
        data: {
          expiresAt,
          id,
        },
      });
    } catch (otpError) {
      console.error(`Failed to send OTP to ${email}:`, otpError);

      // Fallback to traditional login if OTP sending fails
      const tokens = generateTokens(user._id.toString(), user.firstName, [
        user.role,
      ]);

      return res.json({
        message: "Login successful (OTP verification skipped)",
        status: true,
        data: { tokens, user },
      });
    }
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
const getUserProfile = async (req, res) => {
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

const uploadImages = (req, res) => {
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

module.exports = {
  registerUser,
  verifyLoginOTP,
  resendOTP,
  loginUser,
  getUserProfile,
  uploadImages,
  updateUserProfileSchema,
  restrictedFields,
};
