const joi = require("joi");
const bcrypt = require("bcrypt");

const { Company, UserProfile } = require('../model')
const {
  generateSecurePassword,
  sendEmployeeInvitationEmail,
} = require("../utility/mailUtility");
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
const registerCompany = async (req, res) => {
  try {
    const userId = req.body.user.id; // Get the user ID from the authenticated user
    const companyData = req.body;

    // Validate the request body
    const companySchema = joi.object({
      name: joi.string().required().label("Company Name"),
      logo: joi.string().uri().allow("").optional().label("Logo URL"),
      description: joi.string().allow("").optional().label("Description"),
      website: joi.string().uri().allow("").optional().label("Website"),
      industry: joi.string().allow("").optional().label("Industry"),
      size: joi
        .string()
        .valid("1-10", "11-50", "51-200", "201-500", "501-1000", "1000+")
        .optional()
        .label("Company Size"),
      address: joi
        .object({
          street: joi.string().allow("").optional(),
          city: joi.string().allow("").optional(),
          state: joi.string().allow("").optional(),
          country: joi.string().allow("").optional(),
          zipCode: joi.string().allow("").optional(),
        })
        .optional()
        .label("Address"),
      contactEmail: joi
        .string()
        .email()
        .allow("")
        .optional()
        .label("Contact Email"),
      contactPhone: joi.string().allow("").optional().label("Contact Phone"),
      dataAccessPreferences: joi
        .object({
          publicProfile: joi.boolean().optional(),
          shareEmployeeData: joi.boolean().optional(),
          allowExternalIntegrations: joi.boolean().optional(),
          retentionPeriod: joi.number().integer().min(1).optional(),
        })
        .optional()
        .label("Data Access Preferences"),
    });

    const { error, value } = companySchema.validate(companyData);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Find the user and update their role to COMPANY_ADMIN
    const user = await UserProfile.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create the company
    const company = new Company({
      ...value,
      admin: userId,
      employees: [], // Initially empty
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await company.save();

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
    await user.save();

    res.status(201).json({
      message:
        "Company registered successfully. You are now the company admin.",
      data: {
        company,
        user: {
          id: user._id,
          role: user.role,
          company: user.company,
        },
      },
    });
  } catch (error) {
    console.error("Error registering company:", error);
    res
      .status(500)
      .json({ message: "Error registering company", error: error.message });
  }
};

/**
 * Get all companies managed by the authenticated admin
 * @param req
 * @param res
 */
const getAdminCompanies = async (req, res) => {
  try {
    const adminId = req.body.user.id;

    // Find all companies where the admin is the creator
    const companies = await Company.find({ admin: adminId });

    res.status(200).json({
      message: "Companies retrieved successfully",
      data: companies,
    });
  } catch (error) {
    console.error("Error retrieving companies:", error);
    res
      .status(500)
      .json({ message: "Error retrieving companies", error: error.message });
  }
};

/**
 * Update a company's information
 * @param req
 * @param res
 */
const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.body.user.id;
    const updateData = req.body;

    // Find the company
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check if the admin is authorized to update this company
    if (company.admin.toString() !== adminId) {
      return res
        .status(403)
        .json({ message: "Unauthorized access to company" });
    }

    // Update the company
    const updatedCompany = await Company.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );

    res.status(200).json({
      message: "Company updated successfully",
      data: updatedCompany,
    });
  } catch (error) {
    console.error("Error updating company:", error);
    res
      .status(500)
      .json({ message: "Error updating company", error: error.message });
  }
};

/**
 * Update company data access preferences
 * @param req
 * @param res
 */
const updateCompanyPreferences = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.body.user.id;
    const { dataAccessPreferences } = req.body;

    // Find the company
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check if the admin is authorized to update this company
    if (company.admin.toString() !== adminId) {
      return res
        .status(403)
        .json({ message: "Unauthorized access to company" });
    }

    // Update the company preferences
    const updatedCompany = await Company.findByIdAndUpdate(
      id,
      {
        dataAccessPreferences: dataAccessPreferences,
        updatedAt: new Date(),
      },
      { new: true }
    );

    res.status(200).json({
      message: "Company preferences updated successfully",
      data: updatedCompany,
    });
  } catch (error) {
    console.error("Error updating company preferences:", error);
    res.status(500).json({
      message: "Error updating company preferences",
      error: error.message,
    });
  }
};

// /**
//  * Invite an employee to join the company
//  * @param req
//  * @param res
//  */
const inviteEmployee = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { email, role } = req.body;
    const adminId = req.body.user.id;

    // Validate input
    if (!email || !role) {
      return res.status(400).json({ message: "Email and role are required" });
    }

    // Find the company
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check if the admin is authorized to invite employees to this company
    if (company.admin.toString() !== adminId) {
      return res
        .status(403)
        .json({ message: "Unauthorized access to company" });
    }

    // Check if the user already exists
    const existingUser = await UserProfile.findOne({
      "basicDetails.email": email,
    });

    if (existingUser) {
      // If user exists, check if they're already part of the company
      if (
        existingUser.company &&
        existingUser.company.companyId &&
        existingUser.company.companyId.toString() === companyId
      ) {
        return res
          .status(400)
          .json({ message: "User is already part of this company" });
      }

      // Update the existing user with company information
      existingUser.role = role === "ADMIN" ? "COMPANY_ADMIN" : "EMPLOYEE";
      existingUser.company = {
        companyId: company._id,
        companyName: company.name,
        invitedBy: adminId,
        invitationDate: new Date(),
        permissions: {
          canInviteEmployees: role === "ADMIN",
          canManagePermissions: role === "ADMIN",
          canViewStatistics: role === "ADMIN",
          canRevokeAccess: role === "ADMIN",
          canManageCompanyPreferences: role === "ADMIN",
        },
      };

      await existingUser.save();

      // Add user to company's employees array if not already there
      if (!company.employees.includes(existingUser._id)) {
        company.employees.push(existingUser._id);
        await company.save();
      }

      // TODO: Send invitation email to the user

      return res.status(200).json({
        message: "Existing user added to company successfully",
        data: {
          user: {
            id: existingUser._id,
            email: existingUser.email,
            role: existingUser.role,
          },
          company: {
            id: company._id,
            name: company.name,
          },
        },
      });
    } else {
      // Create a new user account for the invited employee
      try {
        // Generate a secure temporary password
        const temporaryPassword = generateSecurePassword();
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        // Get admin name for the invitation email
        const admin = await UserProfile.findById(adminId);
        if (!admin) {
          return res.status(404).json({ message: "Admin not found" });
        }

        const adminName =
          admin.firstName && admin.lastName
            ? `${admin.firstName} ${admin.lastName}`
            : admin.email;

        // Extract first name from email if not provided
        const firstName = email.split("@")[0];

        // Create the new user
        const newUser = new UserProfile({
          firstName: firstName,
          email: email,
          role: role === "ADMIN" ? "COMPANY_ADMIN" : "EMPLOYEE",
          password: hashedPassword,
          passwordResetRequired: true,
          termsOfService: {
            accepted: false,
          },
          onboarding: {
            tutorialCompleted: false,
            completedSteps: [],
          },
          notificationPreferences: {
            email: true,
            inApp: true,
            marketing: false,
            updates: true,
          },
          company: {
            companyId: company._id,
            companyName: company.name,
            invitedBy: adminId,
            invitationDate: new Date(),
            permissions: {
              canInviteEmployees: role === "ADMIN",
              canManagePermissions: role === "ADMIN",
              canViewStatistics: role === "ADMIN",
              canRevokeAccess: role === "ADMIN",
              canManageCompanyPreferences: role === "ADMIN",
            },
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await newUser.save();

        // Add user to company's employees array
        company.employees.push(newUser._id);
        await company.save();

        // Send invitation email
        await sendEmployeeInvitationEmail(
          email,
          firstName,
          company.name,
          temporaryPassword,
          adminName
        );

        return res.status(201).json({
          message:
            "New employee account created and invitation sent successfully",
          data: {
            user: {
              id: newUser._id,
              email: newUser.email,
              role: newUser.role,
            },
            company: {
              id: company._id,
              name: company.name,
            },
          },
        });
      } catch (error) {
        console.error("Error creating new employee account:", error);
        return res.status(500).json({
          message: "Error creating new employee account",
          error: error.message,
          success: false,
        });
      }
    }
  } catch (error) {
    console.error("Error inviting employee:", error);
    res
      .status(500)
      .json({ message: "Error inviting employee", error: error.message });
  }
};

/**
 * Get all employees of a company
 * @param req
 * @param res
 */
const getCompanyEmployees = async (req, res) => {
  try {
    const { companyId } = req.params;
    const adminId = req.body.user.id;

    // Find the company
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check if the admin is authorized to view this company's employees
    if (company.admin.toString() !== adminId) {
      return res
        .status(403)
        .json({ message: "Unauthorized access to company" });
    }

    // Get all employees
    const employees = await UserProfile.find(
      { "company.companyId": companyId },
      {
        "basicDetails.firstName": 1,
        "basicDetails.lastName": 1,
        "basicDetails.email": 1,
        "basicDetails.role": 1,
        "company.department": 1,
        "company.position": 1,
        "company.permissions": 1,
        "company.invitationDate": 1,
        "company.lastActivity": 1,
      }
    );

    res.status(200).json({
      message: "Employees retrieved successfully",
      data: employees,
    });
  } catch (error) {
    console.error("Error retrieving employees:", error);
    res
      .status(500)
      .json({ message: "Error retrieving employees", error: error.message });
  }
};

/**
 * Update employee permissions
 * @param req
 * @param res
 */
const updateEmployeePermissions = async (req, res) => {
  try {
    const { companyId, employeeId } = req.params;
    const adminId = req.body.user.id;
    const { permissions } = req.body;

    // Validate input
    if (!permissions) {
      return res.status(400).json({ message: "Permissions are required" });
    }

    // Find the company
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check if the admin is authorized to manage permissions in this company
    if (company.admin.toString() !== adminId) {
      return res
        .status(403)
        .json({ message: "Unauthorized access to company" });
    }

    // Find the employee
    const employee = await UserProfile.findOne({
      _id: employeeId,
      "company.companyId": companyId,
    });

    if (!employee) {
      return res
        .status(404)
        .json({ message: "Employee not found in this company" });
    }

    // Update the employee's permissions
    employee.company.permissions = {
      ...employee.company.permissions,
      ...permissions,
    };

    await employee.save();

    res.status(200).json({
      message: "Employee permissions updated successfully",
      data: {
        employeeId: employee._id,
        permissions: employee.company.permissions,
      },
    });
  } catch (error) {
    console.error("Error updating employee permissions:", error);
    res.status(500).json({
      message: "Error updating employee permissions",
      error: error.message,
    });
  }
};

/**
 * Track employee activity
 * @param req
 * @param res
 */
const trackEmployeeActivity = async (req, res) => {
  try {
    const { companyId, employeeId } = req.params;
    const adminId = req.body.user.id;

    // Find the company
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check if the admin is authorized to view statistics in this company
    if (company.admin.toString() !== adminId) {
      return res
        .status(403)
        .json({ message: "Unauthorized access to company" });
    }

    // Find the employee and update their last activity
    const employee = await UserProfile.findOneAndUpdate(
      {
        _id: employeeId,
        "company.companyId": companyId,
      },
      {
        "company.lastActivity": new Date(),
      },
      { new: true }
    );

    if (!employee) {
      return res
        .status(404)
        .json({ message: "Employee not found in this company" });
    }

    res.status(200).json({
      message: "Employee activity tracked successfully",
      data: {
        employeeId: employee._id,
        lastActivity: employee.company.lastActivity,
      },
    });
  } catch (error) {
    console.error("Error tracking employee activity:", error);
    res.status(500).json({
      message: "Error tracking employee activity",
      error: error.message,
    });
  }
};

/**
 * Get employee activity statistics
 * @param req
 * @param res
 */
const getEmployeeStatistics = async (req, res) => {
  try {
    const { companyId } = req.params;
    const adminId = req.body.user.id;

    // Find the company
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check if the admin is authorized to view statistics in this company
    if (company.admin.toString() !== adminId) {
      return res
        .status(403)
        .json({ message: "Unauthorized access to company" });
    }

    // Get all employees with their activity data
    const employees = await UserProfile.find(
      { "company.companyId": companyId },
      {
        "basicDetails.firstName": 1,
        "basicDetails.lastName": 1,
        "basicDetails.email": 1,
        "company.lastActivity": 1,
        "company.invitationDate": 1,
      }
    );

    // Calculate statistics
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;

    const statistics = {
      totalEmployees: employees.length,
      activeToday: 0,
      activeThisWeek: 0,
      activeThisMonth: 0,
      inactiveEmployees: 0,
    };

    employees.forEach((employee) => {
      if (!employee.company.lastActivity) {
        statistics.inactiveEmployees++;
        return;
      }

      const lastActivity = new Date(employee.company.lastActivity);
      const timeDiff = now.getTime() - lastActivity.getTime();

      if (timeDiff <= oneDay) {
        statistics.activeToday++;
      }
      if (timeDiff <= oneWeek) {
        statistics.activeThisWeek++;
      }
      if (timeDiff <= oneMonth) {
        statistics.activeThisMonth++;
      }
      if (timeDiff > oneMonth) {
        statistics.inactiveEmployees++;
      }
    });

    res.status(200).json({
      message: "Employee statistics retrieved successfully",
      data: {
        statistics,
        employees,
      },
    });
  } catch (error) {
    console.error("Error retrieving employee statistics:", error);
    res.status(500).json({
      message: "Error retrieving employee statistics",
      error: error.message,
    });
  }
};

/**
 * Revoke employee access
 * @param req
 * @param res
 */
const revokeEmployeeAccess = async (req, res) => {
  try {
    const { companyId, employeeId } = req.params;
    const adminId = req.body.user.id;

    // Find the company
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check if the admin is authorized to revoke access in this company
    if (company.admin.toString() !== adminId) {
      return res
        .status(403)
        .json({ message: "Unauthorized access to company" });
    }

    // Find the employee
    const employee = await UserProfile.findOne({
      _id: employeeId,
      "company.companyId": companyId,
    });

    if (!employee) {
      return res
        .status(404)
        .json({ message: "Employee not found in this company" });
    }

    // Remove the company association from the employee
    employee.company = undefined;
    if (employee.role === "COMPANY_ADMIN" || employee.role === "EMPLOYEE") {
      employee.role = "USER";
    }

    await employee.save();

    // Remove the employee from the company's employees array
    company.employees = company.employees.filter(
      (id) => id.toString() !== employeeId
    );
    await company.save();

    res.status(200).json({
      message: "Employee access revoked successfully",
      data: {
        employeeId: employee._id,
        email: employee.email,
      },
    });
  } catch (error) {
    console.error("Error revoking employee access:", error);
    res.status(500).json({
      message: "Error revoking employee access",
      error: error.message,
    });
  }
};

module.exports = {
  registerCompany,
  getAdminCompanies,
  updateCompany,
  updateCompanyPreferences,
  inviteEmployee,
  getCompanyEmployees,
  updateEmployeePermissions,
  trackEmployeeActivity,
  getEmployeeStatistics,
  revokeEmployeeAccess,
};