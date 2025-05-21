"use strict";
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
exports.getUndertakingUsers = exports.loginAdmin = exports.createAdmin = void 0;
var bcrypt_1 = require("bcrypt");
var crypto_1 = require("crypto");
var joi_1 = require("joi");
var model_1 = require("../model");
var types_1 = require("../types");
var utility_1 = require("../utility");
var user_model_1 = require("../model/user.model");
/**
 *
 * @param req name, email, phoneNumber, role = ADMIN, status="ACTIVE", lastLogin=null,
 * isPasswordResetRequired=true, createdAt = new Date().toISOString(),
 * updatedAt = new Date().toISOString() password we will generate a random
 * password and send it as a response
 * @param res
 */
var createAdmin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var createAdminRequestBody, createAdminSchema, _a, error, value, name_1, email, phoneNumber, generatedPassword, hashedPassword, role, status_1, lastLogin, isPasswordResetRequired, createdAt, updatedAt, admin, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                createAdminRequestBody = req.body;
                createAdminSchema = joi_1.default.object({
                    name: joi_1.default.string().required().label("Name"),
                    email: joi_1.default.string().email().required().label("Email"),
                    phoneNumber: joi_1.default.string().required().label("Phone Number"),
                });
                _a = createAdminSchema.validate(createAdminRequestBody), error = _a.error, value = _a.value;
                if (error) {
                    return [2 /*return*/, res.status(400).json({ message: error.message })];
                }
                name_1 = value.name, email = value.email, phoneNumber = value.phoneNumber;
                generatedPassword = crypto_1.default.randomBytes(8).toString("hex");
                return [4 /*yield*/, bcrypt_1.default.hash(generatedPassword, 10)];
            case 1:
                hashedPassword = _b.sent();
                role = "ADMIN";
                status_1 = types_1.Status.ACTIVE;
                lastLogin = null;
                isPasswordResetRequired = true;
                createdAt = new Date();
                updatedAt = new Date();
                admin = new model_1.Admin({
                    name: name_1,
                    email: email,
                    password: hashedPassword,
                    phoneNumber: phoneNumber,
                    role: role,
                    status: status_1,
                    lastLogin: lastLogin,
                    isPasswordResetRequired: isPasswordResetRequired,
                    createdAt: createdAt,
                    updatedAt: updatedAt,
                });
                return [4 /*yield*/, admin.save()];
            case 2:
                _b.sent();
                res.status(201).json({
                    message: "Admin created",
                    password: generatedPassword,
                    user: admin,
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                res.status(400).json({ message: error_1.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createAdmin = createAdmin;
/**
 * @param req email, password
 * @param res
 */
var loginAdmin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, adminUser, isPasswordValid, tokens, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, password = _a.password;
                console.log({ email: email, password: password });
                return [4 /*yield*/, model_1.Admin.findOne({
                        email: email,
                    })];
            case 1:
                adminUser = _b.sent();
                if (!adminUser) {
                    return [2 /*return*/, res.status(401).json({ message: "Invalid credentials" })];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, adminUser.password)];
            case 2:
                isPasswordValid = _b.sent();
                if (!isPasswordValid) {
                    return [2 /*return*/, res.status(401).json({ message: "Invalid credentials" })];
                }
                tokens = (0, utility_1.generateTokens)(adminUser.id, adminUser.name, [
                    adminUser.role,
                ]);
                return [2 /*return*/, res.status(200).json({
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
                    })];
            case 3:
                error_2 = _b.sent();
                console.log("❌", { error: error_2 });
                return [2 /*return*/, res.status(500).json({ message: "Error logging in", error: error_2 })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.loginAdmin = loginAdmin;
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
var getUndertakingUsers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var adminId, verifiedFilter, admin, userQuery, users, formattedUsers, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                adminId = req.params.id;
                verifiedFilter = req.query.verified;
                return [4 /*yield*/, model_1.Admin.findById(adminId)];
            case 1:
                admin = _a.sent();
                if (!admin) {
                    return [2 /*return*/, res.status(404).json({ message: "Admin not found" })];
                }
                userQuery = {
                    _id: { $in: admin.undertakingUser },
                };
                if (verifiedFilter !== undefined) {
                    userQuery["authentication.isVerified"] = verifiedFilter === "true";
                }
                return [4 /*yield*/, user_model_1.UserProfile.find(userQuery, {
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
                    })];
            case 2:
                users = _a.sent();
                console.log("Users found", { users: users });
                formattedUsers = users.map(function (user) { return ({
                    id: user._id,
                    name: "".concat(user.firstName, " ").concat(user.lastName),
                    email: user.email,
                    age: calculateAge(user.birthday),
                    lastLoginDate: user.updatedAt,
                    userType: user.role,
                }); });
                return [2 /*return*/, res
                        .status(200)
                        .json({ message: "Users found", status: true, data: formattedUsers })];
            case 3:
                error_3 = _a.sent();
                return [2 /*return*/, res.status(500).json({ message: "Error getting users", error: error_3 })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getUndertakingUsers = getUndertakingUsers;
// Helper function to calculate age from birthday
function calculateAge(birthday) {
    var birthDate = new Date(birthday);
    var ageDifMs = Date.now() - birthDate.getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}
