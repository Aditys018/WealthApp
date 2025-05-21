import mongoose, { Document } from "mongoose";
import { Status } from "./admin.type";

/**
 * Company Schema Interface
 */
export interface ICompany extends Document {
  name: string;
  logo?: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: "1-10" | "11-50" | "51-200" | "201-500" | "501-1000" | "1000+";
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  contactEmail?: string;
  contactPhone?: string;
  admin: mongoose.Types.ObjectId;
  employees: mongoose.Types.ObjectId[];
  dataAccessPreferences: {
    publicProfile: boolean;
    shareEmployeeData: boolean;
    allowExternalIntegrations: boolean;
    retentionPeriod: number;
  };
  status: Status | "SUSPENDED";
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Company Registration Request Body
 */
export interface ICompanyRegistrationRequestBody {
  user: {
    id: string;
  },
  name: string;
  logo?: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  contactEmail?: string;
  contactPhone?: string;
  dataAccessPreferences?: {
    publicProfile?: boolean;
    shareEmployeeData?: boolean;
    allowExternalIntegrations?: boolean;
    retentionPeriod?: number;
  };
}

/**
 * Employee Invitation Request Body
 */
export interface IEmployeeInvitationRequestBody {
  email: string;
  role: string;
  companyId: string;
}