"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCompany = void 0;
var joi_1 = require("joi");
// import bcrypt from "bcrypt";
var model_1 = require("../model");
// import {
//     generateSecurePassword,
//     sendEmployeeInvitationEmail,
// } from "../utility/mailUtility";
// interface IBaseRequestBody {
//     user: {
//         id: string;
//     };
// }
/**
 * Register a new company
 * @param req name (required), logo, description, website, industry, size,
 * address, contactEmail, contactPhone, dataAccessPreferences
 * @param res
 */
var registerCompany = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, companyData, companySchema, _a, error, value, user, company, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                userId = req.body.user.id;
                companyData = req.body;
                companySchema = joi_1.default.object({
                    name: joi_1.default.string().required().label("Company Name"),
                    logo: joi_1.default.string().uri().allow("").optional().label("Logo URL"),
                    description: joi_1.default.string().allow("").optional().label("Description"),
                    website: joi_1.default.string().uri().allow("").optional().label("Website"),
                    industry: joi_1.default.string().allow("").optional().label("Industry"),
                    size: joi_1.default
                        .string()
                        .valid("1-10", "11-50", "51-200", "201-500", "501-1000", "1000+")
                        .optional()
                        .label("Company Size"),
                    address: joi_1.default
                        .object({
                        street: joi_1.default.string().allow("").optional(),
                        city: joi_1.default.string().allow("").optional(),
                        state: joi_1.default.string().allow("").optional(),
                        country: joi_1.default.string().allow("").optional(),
                        zipCode: joi_1.default.string().allow("").optional(),
                    })
                        .optional()
                        .label("Address"),
                    contactEmail: joi_1.default
                        .string()
                        .email()
                        .allow("")
                        .optional()
                        .label("Contact Email"),
                    contactPhone: joi_1.default.string().allow("").optional().label("Contact Phone"),
                    dataAccessPreferences: joi_1.default
                        .object({
                        publicProfile: joi_1.default.boolean().optional(),
                        shareEmployeeData: joi_1.default.boolean().optional(),
                        allowExternalIntegrations: joi_1.default.boolean().optional(),
                        retentionPeriod: joi_1.default.number().integer().min(1).optional(),
                    })
                        .optional()
                        .label("Data Access Preferences"),
                });
                _a = companySchema.validate(companyData), error = _a.error, value = _a.value;
                if (error) {
                    return [2 /*return*/, res.status(400).json({ message: error.message })];
                }
                return [4 /*yield*/, model_1.UserProfile.findById(userId)];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                }
                company = new model_1.Company(__assign(__assign({}, value), { admin: userId, employees: [], status: "ACTIVE", createdAt: new Date(), updatedAt: new Date() }));
                return [4 /*yield*/, company.save()];
            case 2:
                _b.sent();
                // Update the user's role to COMPANY_ADMIN and add company information
                user.role = "COMPANY_ADMIN";
                user.company = {
                    companyId: company._id,
                    companyName: company.name,
                    permissions: {
                        canInviteEmployees: true,
                        canManagePermissions: true,
                        canViewStatistics: true,
                        canRevokeAccess: true,
                        canManageCompanyPreferences: true,
                    },
                };
                return [4 /*yield*/, user.save()];
            case 3:
                _b.sent();
                res.status(201).json({
                    message: "Company registered successfully. You are now the company admin.",
                    data: {
                        company: company,
                        user: {
                            id: user._id,
                            role: user.role,
                            company: user.company,
                        },
                    },
                });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _b.sent();
                console.error("Error registering company:", error_1);
                res
                    .status(500)
                    .json({ message: "Error registering company", error: error_1.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.registerCompany = registerCompany;
/**
 * Get all companies managed by the authenticated admin
 * @param req
 * @param res
 */
// export const getAdminCompanies = async (
//     req: Request<{}, {}, IBaseRequestBody>,
//     res: Response
// ) => {
//     try {
//         const adminId = req.body.user.id;
//         // Find all companies where the admin is the creator
//         const companies = await Company.find({admin: adminId});
//         res.status(200).json({
//             message: "Companies retrieved successfully",
//             data: companies,
//         });
//     } catch (error) {
//         console.error("Error retrieving companies:", error);
//         res
//             .status(500)
//             .json({message: "Error retrieving companies", error: error.message});
//     }
// };
/**
 * Get a specific company by ID
 * @param req
 * @param res
 */
// export const getCompanyById = async (req: Request, res: Response) => {
//     // try {
//     //     const {id} = req.params;
//     //     const adminId = req.body.user.id;
//     //     // Find the company
//     //     const company = await Company.findById(id);
//     //     if (!company) {
//     //         return res.status(404).json({message: "Company not found"});
//     //     }
//     //     // Check if the admin is authorized to access this company
//     //     if (company.admin.toString() !== adminId) {
//     //         return res
//     //             .status(403)
//     //             .json({message: "Unauthorized access to company"});
//     //     }
//     //     res.status(200).json({
//     //         message: "Company retrieved successfully",
//     //         data: company,
//     //     });
//     // } catch (error) {
//     //     console.error("Error retrieving company:", error);
//     //     res
//     //         .status(500)
//     //         .json({message: "Error retrieving company", error: error.message});
//     // }
// };
/**
 * Update a company's information
 * @param req
 * @param res
 */
// export const updateCompany = async (req: Request, res: Response) => {
//     try {
//         const {id} = req.params;
//         const adminId = req.body.user.id;
//         const updateData = req.body;
//         // Find the company
//         const company = await Company.findById(id);
//         if (!company) {
//             return res.status(404).json({message: "Company not found"});
//         }
//         // Check if the admin is authorized to update this company
//         if (company.admin.toString() !== adminId) {
//             return res
//                 .status(403)
//                 .json({message: "Unauthorized access to company"});
//         }
//         // Update the company
//         const updatedCompany = await Company.findByIdAndUpdate(
//             id,
//             {...updateData, updatedAt: new Date()},
//             {new: true}
//         );
//         res.status(200).json({
//             message: "Company updated successfully",
//             data: updatedCompany,
//         });
//     } catch (error) {
//         console.error("Error updating company:", error);
//         res
//             .status(500)
//             .json({message: "Error updating company", error: error.message});
//     }
// };
// /**
//  * Update company data access preferences
//  * @param req
//  * @param res
//  */
// export const updateCompanyPreferences = async (req: Request, res: Response) => {
//     try {
//         const {id} = req.params;
//         const adminId = req.body.user.id;
//         const {dataAccessPreferences} = req.body;
//         // Find the company
//         const company = await Company.findById(id);
//         if (!company) {
//             return res.status(404).json({message: "Company not found"});
//         }
//         // Check if the admin is authorized to update this company
//         if (company.admin.toString() !== adminId) {
//             return res
//                 .status(403)
//                 .json({message: "Unauthorized access to company"});
//         }
//         // Update the company preferences
//         const updatedCompany = await Company.findByIdAndUpdate(
//             id,
//             {
//                 dataAccessPreferences: dataAccessPreferences,
//                 updatedAt: new Date(),
//             },
//             {new: true}
//         );
//         res.status(200).json({
//             message: "Company preferences updated successfully",
//             data: updatedCompany,
//         });
//     } catch (error) {
//         console.error("Error updating company preferences:", error);
//         res.status(500).json({
//             message: "Error updating company preferences",
//             error: error.message,
//         });
//     }
// };
// /**
//  * Invite an employee to join the company
//  * @param req
//  * @param res
//  */
// export const inviteEmployee = async (req: Request, res: Response) => {
//     try {
//         const {companyId} = req.params;
//         const {email, role} = req.body;
//         const adminId = req.body.user.id;
//         // Validate input
//         if (!email || !role) {
//             return res.status(400).json({message: "Email and role are required"});
//         }
//         // Find the company
//         const company = await Company.findById(companyId);
//         if (!company) {
//             return res.status(404).json({message: "Company not found"});
//         }
//         // Check if the admin is authorized to invite employees to this company
//         if (company.admin.toString() !== adminId) {
//             return res
//                 .status(403)
//                 .json({message: "Unauthorized access to company"});
//         }
//         // Check if the user already exists
//         const existingUser = await UserProfile.findOne({
//             "basicDetails.email": email,
//         });
//         if (existingUser) {
//             // If user exists, check if they're already part of the company
//             if (
//                 existingUser.company &&
//                 existingUser.company.companyId &&
//                 existingUser.company.companyId.toString() === companyId
//             ) {
//                 return res
//                     .status(400)
//                     .json({message: "User is already part of this company"});
//             }
//             // Update the existing user with company information
//             existingUser.role =
//                 role === "ADMIN" ? "COMPANY_ADMIN" : "EMPLOYEE";
//             existingUser.company = {
//                 companyId: company._id,
//                 companyName: company.name,
//                 invitedBy: adminId,
//                 invitationDate: new Date(),
//                 permissions: {
//                     canInviteEmployees: role === "ADMIN",
//                     canManagePermissions: role === "ADMIN",
//                     canViewStatistics: role === "ADMIN",
//                     canRevokeAccess: role === "ADMIN",
//                     canManageCompanyPreferences: role === "ADMIN",
//                 },
//             };
//             await existingUser.save();
//             // Add user to company's employees array if not already there
//             if (!company.employees.includes(existingUser._id)) {
//                 company.employees.push(existingUser._id);
//                 await company.save();
//             }
//             // TODO: Send invitation email to the user
//             return res.status(200).json({
//                 message: "Existing user added to company successfully",
//                 data: {
//                     user: {
//                         id: existingUser._id,
//                         email: existingUser.email,
//                         role: existingUser.role,
//                     },
//                     company: {
//                         id: company._id,
//                         name: company.name,
//                     },
//                 },
//             });
//         } else {
//             // Create a new user account for the invited employee
//             try {
//                 // Generate a secure temporary password
//                 const temporaryPassword = generateSecurePassword();
//                 const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
//                 // Get admin name for the invitation email
//                 const admin = await UserProfile.findById(adminId);
//                 if (!admin) {
//                     return res.status(404).json({message: "Admin not found"});
//                 }
//                 const adminName =
//                     admin.firstName && admin.lastName
//                         ? `${admin.firstName} ${admin.lastName}`
//                         : admin.email;
//                 // Extract first name from email if not provided
//                 const firstName = email.split("@")[0];
//                 // Create the new user
//                 const newUser = new UserProfile({
//                     firstName: firstName,
//                     email: email,
//                     role: role === "ADMIN" ? "COMPANY_ADMIN" : "EMPLOYEE",
//                     password: hashedPassword,
//                     passwordResetRequired: true,
//                     termsOfService: {
//                         accepted: false,
//                     },
//                     onboarding: {
//                         tutorialCompleted: false,
//                         completedSteps: [],
//                     },
//                     notificationPreferences: {
//                         email: true,
//                         inApp: true,
//                         marketing: false,
//                         updates: true,
//                     },
//                     company: {
//                         companyId: company._id,
//                         companyName: company.name,
//                         invitedBy: adminId,
//                         invitationDate: new Date(),
//                         permissions: {
//                             canInviteEmployees: role === "ADMIN",
//                             canManagePermissions: role === "ADMIN",
//                             canViewStatistics: role === "ADMIN",
//                             canRevokeAccess: role === "ADMIN",
//                             canManageCompanyPreferences: role === "ADMIN",
//                         },
//                     },
//                     createdAt: new Date(),
//                     updatedAt: new Date(),
//                 });
//                 await newUser.save();
//                 // Add user to company's employees array
//                 company.employees.push(newUser._id);
//                 await company.save();
//                 // Send invitation email
//                 await sendEmployeeInvitationEmail(
//                     email,
//                     firstName,
//                     company.name,
//                     temporaryPassword,
//                     adminName
//                 );
//                 return res.status(201).json({
//                     message:
//                         "New employee account created and invitation sent successfully",
//                     data: {
//                         user: {
//                             id: newUser._id,
//                             email: newUser.email,
//                             role: newUser.role,
//                         },
//                         company: {
//                             id: company._id,
//                             name: company.name,
//                         },
//                     },
//                 });
//             } catch (error) {
//                 console.error("Error creating new employee account:", error);
//                 return res.status(500).json({
//                     message: "Error creating new employee account",
//                     error: error.message,
//                     success: false,
//                 });
//             }
//         }
//     } catch (error) {
//         console.error("Error inviting employee:", error);
//         res
//             .status(500)
//             .json({message: "Error inviting employee", error: error.message});
//     }
// };
// /**
//  * Get all employees of a company
//  * @param req
//  * @param res
//  */
// export const getCompanyEmployees = async (req: Request, res: Response) => {
//     try {
//         const {companyId} = req.params;
//         const adminId = req.body.user.id;
//         // Find the company
//         const company = await Company.findById(companyId);
//         if (!company) {
//             return res.status(404).json({message: "Company not found"});
//         }
//         // Check if the admin is authorized to view this company's employees
//         if (company.admin.toString() !== adminId) {
//             return res
//                 .status(403)
//                 .json({message: "Unauthorized access to company"});
//         }
//         // Get all employees
//         const employees = await UserProfile.find(
//             {"company.companyId": companyId},
//             {
//                 "basicDetails.firstName": 1,
//                 "basicDetails.lastName": 1,
//                 "basicDetails.email": 1,
//                 "basicDetails.role": 1,
//                 "company.department": 1,
//                 "company.position": 1,
//                 "company.permissions": 1,
//                 "company.invitationDate": 1,
//                 "company.lastActivity": 1,
//             }
//         );
//         res.status(200).json({
//             message: "Employees retrieved successfully",
//             data: employees,
//         });
//     } catch (error) {
//         console.error("Error retrieving employees:", error);
//         res
//             .status(500)
//             .json({message: "Error retrieving employees", error: error.message});
//     }
// };
// /**
//  * Update employee permissions
//  * @param req
//  * @param res
//  */
// export const updateEmployeePermissions = async (
//     req: Request,
//     res: Response
// ) => {
//     try {
//         const {companyId, employeeId} = req.params;
//         const adminId = req.body.user.id;
//         const {permissions} = req.body;
//         // Validate input
//         if (!permissions) {
//             return res.status(400).json({message: "Permissions are required"});
//         }
//         // Find the company
//         const company = await Company.findById(companyId);
//         if (!company) {
//             return res.status(404).json({message: "Company not found"});
//         }
//         // Check if the admin is authorized to manage permissions in this company
//         if (company.admin.toString() !== adminId) {
//             return res
//                 .status(403)
//                 .json({message: "Unauthorized access to company"});
//         }
//         // Find the employee
//         const employee = await UserProfile.findOne({
//             _id: employeeId,
//             "company.companyId": companyId,
//         });
//         if (!employee) {
//             return res
//                 .status(404)
//                 .json({message: "Employee not found in this company"});
//         }
//         // Update the employee's permissions
//         employee.company.permissions = {
//             ...employee.company.permissions,
//             ...permissions,
//         };
//         await employee.save();
//         res.status(200).json({
//             message: "Employee permissions updated successfully",
//             data: {
//                 employeeId: employee._id,
//                 permissions: employee.company.permissions,
//             },
//         });
//     } catch (error) {
//         console.error("Error updating employee permissions:", error);
//         res.status(500).json({
//             message: "Error updating employee permissions",
//             error: error.message,
//         });
//     }
// };
// /**
//  * Track employee activity
//  * @param req
//  * @param res
//  */
// export const trackEmployeeActivity = async (req: Request, res: Response) => {
//     try {
//         const {companyId, employeeId} = req.params;
//         const adminId = req.body.user.id;
//         // Find the company
//         const company = await Company.findById(companyId);
//         if (!company) {
//             return res.status(404).json({message: "Company not found"});
//         }
//         // Check if the admin is authorized to view statistics in this company
//         if (company.admin.toString() !== adminId) {
//             return res
//                 .status(403)
//                 .json({message: "Unauthorized access to company"});
//         }
//         // Find the employee and update their last activity
//         const employee = await UserProfile.findOneAndUpdate(
//             {
//                 _id: employeeId,
//                 "company.companyId": companyId,
//             },
//             {
//                 "company.lastActivity": new Date(),
//             },
//             {new: true}
//         );
//         if (!employee) {
//             return res
//                 .status(404)
//                 .json({message: "Employee not found in this company"});
//         }
//         res.status(200).json({
//             message: "Employee activity tracked successfully",
//             data: {
//                 employeeId: employee._id,
//                 lastActivity: employee.company.lastActivity,
//             },
//         });
//     } catch (error) {
//         console.error("Error tracking employee activity:", error);
//         res.status(500).json({
//             message: "Error tracking employee activity",
//             error: error.message,
//         });
//     }
// };
// /**
//  * Get employee activity statistics
//  * @param req
//  * @param res
//  */
// export const getEmployeeStatistics = async (req: Request, res: Response) => {
//     try {
//         const {companyId} = req.params;
//         const adminId = req.body.user.id;
//         // Find the company
//         const company = await Company.findById(companyId);
//         if (!company) {
//             return res.status(404).json({message: "Company not found"});
//         }
//         // Check if the admin is authorized to view statistics in this company
//         if (company.admin.toString() !== adminId) {
//             return res
//                 .status(403)
//                 .json({message: "Unauthorized access to company"});
//         }
//         // Get all employees with their activity data
//         const employees = await UserProfile.find(
//             {"company.companyId": companyId},
//             {
//                 "basicDetails.firstName": 1,
//                 "basicDetails.lastName": 1,
//                 "basicDetails.email": 1,
//                 "company.lastActivity": 1,
//                 "company.invitationDate": 1,
//             }
//         );
//         // Calculate statistics
//         const now = new Date();
//         const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
//         const oneWeek = 7 * oneDay;
//         const oneMonth = 30 * oneDay;
//         const statistics = {
//             totalEmployees: employees.length,
//             activeToday: 0,
//             activeThisWeek: 0,
//             activeThisMonth: 0,
//             inactiveEmployees: 0,
//         };
//         employees.forEach((employee) => {
//             if (!employee.company.lastActivity) {
//                 statistics.inactiveEmployees++;
//                 return;
//             }
//             const lastActivity = new Date(employee.company.lastActivity);
//             const timeDiff = now.getTime() - lastActivity.getTime();
//             if (timeDiff <= oneDay) {
//                 statistics.activeToday++;
//             }
//             if (timeDiff <= oneWeek) {
//                 statistics.activeThisWeek++;
//             }
//             if (timeDiff <= oneMonth) {
//                 statistics.activeThisMonth++;
//             }
//             if (timeDiff > oneMonth) {
//                 statistics.inactiveEmployees++;
//             }
//         });
//         res.status(200).json({
//             message: "Employee statistics retrieved successfully",
//             data: {
//                 statistics,
//                 employees,
//             },
//         });
//     } catch (error) {
//         console.error("Error retrieving employee statistics:", error);
//         res.status(500).json({
//             message: "Error retrieving employee statistics",
//             error: error.message,
//         });
//     }
// };
// /**
//  * Revoke employee access
//  * @param req
//  * @param res
//  */
// export const revokeEmployeeAccess = async (req: Request, res: Response) => {
//     try {
//         const {companyId, employeeId} = req.params;
//         const adminId = req.body.user.id;
//         // Find the company
//         const company = await Company.findById(companyId);
//         if (!company) {
//             return res.status(404).json({message: "Company not found"});
//         }
//         // Check if the admin is authorized to revoke access in this company
//         if (company.admin.toString() !== adminId) {
//             return res
//                 .status(403)
//                 .json({message: "Unauthorized access to company"});
//         }
//         // Find the employee
//         const employee = await UserProfile.findOne({
//             _id: employeeId,
//             "company.companyId": companyId,
//         });
//         if (!employee) {
//             return res
//                 .status(404)
//                 .json({message: "Employee not found in this company"});
//         }
//         // Remove the company association from the employee
//         employee.company = undefined;
//         if (
//             employee.role === "COMPANY_ADMIN" ||
//             employee.role === "EMPLOYEE"
//         ) {
//             employee.role = "USER";
//         }
//         await employee.save();
//         // Remove the employee from the company's employees array
//         company.employees = company.employees.filter(
//             (id) => id.toString() !== employeeId
//         );
//         await company.save();
//         res.status(200).json({
//             message: "Employee access revoked successfully",
//             data: {
//                 employeeId: employee._id,
//                 email: employee.email,
//             },
//         });
//     } catch (error) {
//         console.error("Error revoking employee access:", error);
//         res.status(500).json({
//             message: "Error revoking employee access",
//             error: error.message,
//         });
//     }
// };
