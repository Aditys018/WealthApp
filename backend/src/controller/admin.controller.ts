import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import joi from "joi";

import { Admin } from "../model";
import { Status } from "../types";
import { generateTokens } from "../utility";
import { UserProfile } from "../model/user.model";

/**
 *
 * @param req name, email, phoneNumber, role = ADMIN, status="ACTIVE", lastLogin=null, 
 * isPasswordResetRequired=true, createdAt = new Date().toISOString(), 
 * updatedAt = new Date().toISOString() password we will generate a random 
 * password and send it as a response
 * @param res
 */
export const createAdmin = async (req: Request, res: Response) => {
  try {
    const createAdminRequestBody = req.body;
    const createAdminSchema = joi.object({
      name: joi.string().required().label("Name"),
      email: joi.string().email().required().label("Email"),
      phoneNumber: joi.string().required().label("Phone Number"),
    });
    const { error, value } = createAdminSchema.validate(createAdminRequestBody);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const { name, email, phoneNumber } = value;
    const generatedPassword = crypto.randomBytes(8).toString("hex");
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);
    const role = "ADMIN";
    const status: Status = Status.ACTIVE;
    const lastLogin: null = null;
    const isPasswordResetRequired = true;
    const createdAt = new Date();
    const updatedAt = new Date();

    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
      status,
      lastLogin,
      isPasswordResetRequired,
      createdAt,
      updatedAt,
    });

    await admin.save();

    res.status(201).json({
      message: "Admin created",
      password: generatedPassword,
      user: admin,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @param req email, password
 * @param res
 */
export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log({ email, password });
    const adminUser = await Admin.findOne({
      email,
    });

    if (!adminUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, adminUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const tokens = generateTokens(adminUser.id, adminUser.name, [
      adminUser.role,
    ]);

    return res.status(200).json({
      message: "Admin login successful",
      data: {
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
        user: {
          _id: adminUser._id,
          email: adminUser.email,
          name: adminUser.name,
          phoneNumber: adminUser.phoneNumber,
          role: adminUser.role,
          status: adminUser.status,
          lastLogin: adminUser.lastLogin,
          createdAt: adminUser.createdAt,
          updatedAt: adminUser.updatedAt,
        },
      },
    });
  } catch (error) {
    console.log("❌", { error });
    return res.status(500).json({ message: "Error logging in", error });
  }
};

/**
 * @param req
 * @param res
 * Api to get all the users under the admin/matchmaker
 * @returns
 * 200 - success
 * 400 - error
 * 500 - server error
 * 401 - unauthorized
 * 403 - forbidden
 * 404 - not found
 */
// export const getAllUsers = async (req: Request, res: Response) => {
// 	try {
// 		const adminId = req.user.id;
// 		const users = await Admin.find({ matchmaker: adminId }).populate("users");
// 		if (!users) {
// 			return res.status(404).json({ message: "No users found" });
// 		}
// 		return res.status(200).json({ message: "Users found", users });
// 	} catch (error) {
// 		console.log("❌", { error });
// 		return res.status(500).json({ message: "Error getting users", error });
// 	}
// };

export const getUndertakingUsers = async (req: Request, res: Response) => {
  try {
    const adminId = req.params.id;
    const verifiedFilter = req.query.verified;

    // Fetch admin details to get undertaking user IDs
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Build query for users
    const userQuery: Record<string, any> = {
      _id: { $in: admin.undertakingUser },
    };
    if (verifiedFilter !== undefined) {
      userQuery["authentication.isVerified"] = verifiedFilter === "true";
    }

    // Fetch user details
    const users = await UserProfile.find(userQuery, {
      "basicDetails.firstName": 1,
      "basicDetails.lastName": 1,
      "basicDetails.email": 1,
      "basicDetails.birthday": 1,
      "basicDetails.currentCity": 1,
      "basicDetails.phoneNumber": 1,
      "basicDetails.role": 1,
      "workAndEducation.currentCompany": 1,
      "workAndEducation.currentDesignation": 1,
      "workAndEducation.currentSalary": 1,
      "workAndEducation.currentCompanyLocation": 1,
      profileStage: 1,
      paymentDetails: 1,

      createdAt: 1,
      updatedAt: 1,
    });

    console.log("Users found", { users });

    // Format user data
    const formattedUsers = users.map((user) => ({
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      age: calculateAge(user.birthday),
      lastLoginDate: user.updatedAt,
      userType: user.role,
    }));

    return res
      .status(200)
      .json({ message: "Users found", status: true, data: formattedUsers });
  } catch (error) {
    return res.status(500).json({ message: "Error getting users", error });
  }
};

// Helper function to calculate age from birthday
function calculateAge(birthday: string): number {
  const birthDate = new Date(birthday);
  const ageDifMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}
