const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { OTP } = require("../model");
const { createAndSendOTP } = require("../utility/mailUtility");

const getAccessTokenFromRefreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const { error } = Joi.string().required().validate(refreshToken);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
        status: false,
        message: "Invalid refresh token",
      });
    }
    const { id, name, permissions } = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const accessToken = jwt.sign(
      { id, name, permissions },
      process.env.JWT_TOKEN_SECRET,
      { expiresIn: "3m" }
    );

    res.json({
      message: "Token refreshed",
      status: true,
      data: { accessToken },
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      status: false,
      message: "Token refresh failed",
    });
  }
};

const sendOtp = async (req, res) => {
  try {
    const { firstName, email } = req.body;
    const { expiresAt, id } = await createAndSendOTP(email, firstName);
    console.log("OTP sent successfully", { expiresAt, id });
    return res.status(200).json({
      message: "OTP sent successfully",
      status: true,
      data: {
        expiresAt,
        id,
      },
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message,
      status: false,
      message: "Failed to send OTP",
      data: {
        expiresAt,
        id,
      }
    });
  }
};

module.exports = {
  getAccessTokenFromRefreshToken,
  sendOtp
};
