import mongoose from "mongoose";

// Define the Mongoose schema for Company
const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    logo: { type: String }, // URL to the company logo
    description: { type: String },
    website: { type: String },
    industry: { type: String },
    size: { 
      type: String, 
      enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"] 
    },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      zipCode: { type: String }
    },
    contactEmail: { type: String },
    contactPhone: { type: String },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "admin", required: true }, // Reference to the admin who created the company
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }], // References to users who are employees
    dataAccessPreferences: {
      publicProfile: { type: Boolean, default: true },
      shareEmployeeData: { type: Boolean, default: false },
      allowExternalIntegrations: { type: Boolean, default: true },
      retentionPeriod: { type: Number, default: 365 } // Days to retain data
    },
    status: { 
      type: String, 
      enum: ["ACTIVE", "INACTIVE", "SUSPENDED"], 
      default: "ACTIVE" 
    },
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() }
  },
  { timestamps: true } // Automatically handles createdAt & updatedAt
);

export const Company = mongoose.model("company", companySchema);
