# WealthApp

## Admin Features

WealthApp provides a comprehensive set of admin features for company management:

### Company Management
- **Company Registration**: Users can register a company and automatically become the company admin
- **Company Information Management**: Company admins can view and update company details
- **Company Data Access Preferences**: Company admins can set company-wide data access preferences

### Employee Management
- **Employee Invitation**: Company admins can invite employees via email
- **Permission Management**: Company admins can manage employee permission levels
- **Activity Monitoring**: Company admins can view employee activity and usage statistics
- **Access Control**: Company admins can revoke access for former employees

## User Authentication and Security

### Email Notifications
- **Registration Confirmation**: Users receive an email confirmation after successful registration
- **Login OTP Verification**: Two-factor authentication with OTP sent via email during login
- **Employee Invitations**: Employees receive email invitations with clear instructions and temporary credentials

### OTP Verification
- **Login Security**: Enhanced security with one-time passwords for login verification
- **Time-Limited OTPs**: OTPs expire after 10 minutes for improved security
- **Resend Functionality**: Users can request a new OTP if needed

## Employee Onboarding

### Secure Account Setup
- **Email Invitations**: Employees receive email invitations with clear instructions
- **Secure Password Requirements**: Passwords must meet strict security requirements (length, complexity, etc.)
- **Multi-Factor Authentication**: Employees can set up MFA for enhanced account security

### Terms and Onboarding
- **Terms of Service**: Employees must review and accept the terms of service
- **Onboarding Tutorial**: Step-by-step tutorial to help employees learn the platform
- **Notification Preferences**: Employees can customize how they receive notifications

## API Documentation

### Authentication APIs
- `POST /user/register` - Register a new user
- `POST /user/login` - Login with email and password (triggers OTP email)
- `POST /user/verify-otp` - Verify the OTP sent during login
- `POST /user/resend-otp` - Request a new OTP for verification

### Company APIs

#### Company Management
- `POST /companies/register` - Register a new company (automatically becomes company admin)
- `GET /companies` - Get all companies managed by the user
- `GET /companies/:id` - Get a specific company by ID
- `PUT /companies/:id` - Update a company's information
- `PUT /companies/:id/preferences` - Update a company's data access preferences

#### Employee Management
- `POST /companies/:companyId/employees/invite` - Invite an employee to join the company (company admin access)
- `GET /companies/:companyId/employees` - Get all employees of a company (company admin access)
- `PUT /companies/:companyId/employees/:employeeId/permissions` - Update an employee's permissions (company admin access)
- `POST /companies/:companyId/employees/:employeeId/activity` - Track an employee's activity (company admin access)
- `GET /companies/:companyId/employees/statistics` - Get employee activity statistics (company admin access)
- `DELETE /companies/:companyId/employees/:employeeId` - Revoke an employee's access (company admin access)

### Employee Onboarding APIs

#### Account Setup
- `POST /employee/change-password` - Change password with secure validation
- `POST /employee/mfa/setup` - Enable or disable multi-factor authentication

#### Terms and Onboarding
- `POST /employee/terms/accept` - Accept the terms of service
- `POST /employee/tutorial/progress` - Update tutorial progress
- `POST /employee/notifications/preferences` - Update notification preferences
- `GET /employee/onboarding/status` - Get current onboarding status
