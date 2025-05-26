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

// Sample data for generating random wealth info
const wealthCategories = [
  'Ultra High Net Worth', 
  'High Net Worth', 
  'Affluent', 
  'Upper Middle Class', 
  'Middle Class', 
  'Working Class',
  'Emerging Wealth'
];

const investmentTypes = [
  'Stocks', 'Real Estate', 'Bonds', 'Cryptocurrency', 'Private Equity', 
  'Venture Capital', 'Commodities', 'Art & Collectibles', 'Hedge Funds', 
  'Index Funds', 'REITs', 'Foreign Exchange', 'Startups'
];

const incomeSourceTypes = [
  'Salary', 'Business Ownership', 'Investments', 'Real Estate', 
  'Consulting', 'Royalties', 'Dividends', 'Capital Gains', 
  'Pension', 'Trust Fund', 'Freelancing', 'E-commerce'
];

const assetTypes = [
  'Primary Residence', 'Investment Properties', 'Vacation Homes', 
  'Luxury Vehicles', 'Boats/Yachts', 'Private Jets', 'Art Collection', 
  'Jewelry', 'Business Equity', 'Stock Portfolio', 'Bonds', 
  'Cash & Savings', 'Retirement Accounts'
];

const firstNames = [
  'Alexander', 'Sophia', 'William', 'Emma', 'James', 'Olivia', 
  'Benjamin', 'Isabella', 'Lucas', 'Ava', 'Henry', 'Charlotte',
  'Sebastian', 'Amelia', 'Theodore', 'Harper', 'Oliver', 'Evelyn'
];

const lastNames = [
  'Harrison', 'Montgomery', 'Blackwood', 'Sterling', 'Ashworth', 
  'Whitman', 'Pemberton', 'Thornton', 'Aldrich', 'Covington',
  'Fitzgerald', 'Vanderbilt', 'Carnegie', 'Rockefeller', 'Morgan'
];

// Utility functions
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomFloat = (min, max, decimals = 2) => 
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

const formatCurrency = (amount) => 
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);

const generateRandomInvestments = () => {
  const numInvestments = getRandomNumber(3, 8);
  const investments = [];
  
  for (let i = 0; i < numInvestments; i++) {
    investments.push({
      type: getRandomElement(investmentTypes),
      value: getRandomNumber(5000, 2000000),
      percentage: getRandomFloat(5, 25, 1),
      performance: getRandomFloat(-15, 35, 2) + '%'
    });
  }
  
  return investments;
};

const generateRandomAssets = () => {
  const numAssets = getRandomNumber(4, 10);
  const assets = [];
  
  for (let i = 0; i < numAssets; i++) {
    assets.push({
      type: getRandomElement(assetTypes),
      value: getRandomNumber(10000, 5000000),
      description: `Premium ${getRandomElement(assetTypes).toLowerCase()}`,
      acquisitionYear: getRandomNumber(2010, 2024)
    });
  }
  
  return assets;
};

const generateRandomIncomeStreams = () => {
  const numStreams = getRandomNumber(2, 6);
  const incomeStreams = [];
  
  for (let i = 0; i < numStreams; i++) {
    incomeStreams.push({
      source: getRandomElement(incomeSourceTypes),
      monthlyAmount: getRandomNumber(2000, 150000),
      annualAmount: getRandomNumber(24000, 1800000),
      stability: getRandomElement(['Stable', 'Variable', 'Seasonal', 'Growth-oriented'])
    });
  }
  
  return incomeStreams;
};

const calculateWealthCategory = (netWorth) => {
  if (netWorth >= 30000000) return 'Ultra High Net Worth';
  if (netWorth >= 1000000) return 'High Net Worth';
  if (netWorth >= 500000) return 'Affluent';
  if (netWorth >= 250000) return 'Upper Middle Class';
  if (netWorth >= 100000) return 'Middle Class';
  if (netWorth >= 25000) return 'Working Class';
  return 'Building Wealth';
};

// API Routes

// Get random wealth info for a single user
const getRandomWealth = (req, res) => {
  try {
    const netWorth = getRandomNumber(10000, 50000000);
    const totalAssets = netWorth + getRandomNumber(50000, 500000);
    const totalLiabilities = totalAssets - netWorth;
    
    const wealthInfo = {
      user: {
        id: getRandomNumber(1000, 9999),
        firstName: getRandomElement(firstNames),
        lastName: getRandomElement(lastNames),
        age: getRandomNumber(25, 75),
        location: getRandomElement(['New York', 'California', 'Texas', 'Florida', 'Illinois'])
      },
      financialOverview: {
        netWorth: netWorth,
        netWorthFormatted: formatCurrency(netWorth),
        totalAssets: totalAssets,
        totalAssetsFormatted: formatCurrency(totalAssets),
        totalLiabilities: totalLiabilities,
        totalLiabilitiesFormatted: formatCurrency(totalLiabilities),
        wealthCategory: calculateWealthCategory(netWorth),
        lastUpdated: new Date().toISOString()
      },
      investments: generateRandomInvestments(),
      assets: generateRandomAssets(),
      incomeStreams: generateRandomIncomeStreams(),
      financialMetrics: {
        monthlyIncome: getRandomNumber(5000, 200000),
        monthlyExpenses: getRandomNumber(3000, 100000),
        savingsRate: getRandomFloat(10, 40, 1) + '%',
        debtToIncomeRatio: getRandomFloat(10, 45, 1) + '%',
        investmentAllocation: {
          stocks: getRandomFloat(30, 60, 1) + '%',
          bonds: getRandomFloat(10, 30, 1) + '%',
          realEstate: getRandomFloat(15, 40, 1) + '%',
          alternative: getRandomFloat(5, 20, 1) + '%'
        }
      },
      wealthGrowth: {
        oneYearGrowth: getRandomFloat(-10, 25, 2) + '%',
        fiveYearGrowth: getRandomFloat(20, 180, 2) + '%',
        projectedTenYearGrowth: getRandomFloat(50, 300, 2) + '%'
      }
    };

    res.json({
      success: true,
      data: wealthInfo,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate wealth information',
      message: error.message
    });
  }
}



module.exports = {
  verifyLoginOTP,
  resendOTP,
  loginUser,
  getUserProfile,
  uploadImages,
  changePassword,
  getRandomWealth,
};
