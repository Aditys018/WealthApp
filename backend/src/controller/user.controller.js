const Joi = require("joi");
const bcrypt = require("bcrypt");

const { UserProfile, Admin } = require("../model");
const { generateTokens } = require("../utility");
const {
  sendRegistrationEmail,
  createAndSendOTP,
  verifyOTP,
} = require("../utility/mailUtility");

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

// accept old password and new password
const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().min(8).label("Old Password"),
  newPassword: Joi.string().required().min(8).label("New Password"),
});
const changePassword = async (req, res) => {
  console.log("req.body", req.body);
  try {
    const { error } = changePasswordSchema.validate(req.body);
    console.log("req.body", req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
        status: false,
        message: "Invalid password format",
      });
    }

    console.log("req.user", req.user);

    const user = await UserProfile.findById(req.user.id);
    console.log("user", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isOldPasswordValid = await bcrypt.compare(
      req.body.oldPassword,
      user.password
    );
    console.log("isOldPasswordValid", isOldPasswordValid);
    if (!isOldPasswordValid) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    user.password = await bcrypt.hash(req.body.newPassword, 10);
    // also set forceChangePassword to false
    user.passwordResetRequired = false;

    await user.save();

    res.status(200).json({ message: "Password changed successfully", status: true });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({
      error: err.message,
      status: false,
      message: "Failed to change password",
      description: err.message,
    });
  }

   
};

module.exports = {
  verifyLoginOTP,
  resendOTP,
  loginUser,
  getUserProfile,
  uploadImages,
  changePassword,
};
