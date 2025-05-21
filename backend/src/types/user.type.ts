import { Document } from 'mongoose';

export interface OTP {
  code: string;
  expiresAt: Date;
  verified: boolean;
}

export interface CompanyPermissions {
  canInviteEmployees: boolean;
  canManagePermissions: boolean;
  canViewStatistics: boolean;
  canRevokeAccess: boolean;
  canManageCompanyPreferences: boolean;
}

export interface CompanyInfo {
  companyId: string;
  companyName: string;
  department: string;
  position: string;
  permissions: CompanyPermissions;
  invitedBy?: string;
  invitationDate?: Date;
  lastActivity?: Date;
}

export interface TermsOfService {
  accepted: boolean;
  acceptedAt?: Date;
  version?: string;
}

export interface Onboarding {
  tutorialCompleted: boolean;
  completedSteps?: string[];
  lastCompletedStep?: string;
  completedAt?: Date;
}

export interface NotificationPreferences {
  email: boolean;
  inApp: boolean;
  marketing: boolean;
  updates: boolean;
}

export interface UserProfile extends Document {
  firstName?: string;
  lastName?: string;
  gender?: 'Male' | 'Female';
  birthday?: string;
  country?: string;
  city?: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'EMPLOYEE' | 'COMPANY_ADMIN';
  password: string;
  passwordResetRequired?: boolean;
  otp?: OTP;
  mfaEnabled?: boolean;
  termsOfService?: TermsOfService;
  onboarding?: Onboarding;
  notificationPreferences?: NotificationPreferences;
  company?: CompanyInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginOTPRequest {
  email: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}
