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
- `POST /user/login` 
  - **Description**: Login with email and password (triggers OTP email)
  - **Request Body**: 
    - `email` (string, required): User's email address
    - `password` (string, required): User's password
  - **Response**: OTP details for verification

- `POST /user/verify-otp` 
  - **Description**: Verify the OTP sent during login
  - **Request Body**: 
    - `email` (string, required): User's email address
    - `otp` (string, required): One-time password received via email
    - `otpId` (string, required): OTP identifier
  - **Response**: Authentication tokens and user details

- `POST /user/resend-otp` 
  - **Description**: Request a new OTP for verification
  - **Request Body**: 
    - `email` (string, required): User's email address
  - **Response**: New OTP details

- `POST /user/change-password` 
  - **Description**: Change user password
  - **Request Body**: 
    - `oldPassword` (string, required): Current password
    - `newPassword` (string, required): New password (min 8 characters)
  - **Response**: Success message

- `GET /user/random-wealth` 
  - **Description**: Get random wealth information
  - **Authentication**: Required (ADMIN, COMPANY_ADMIN, EMPLOYEE)
  - **Response**: Random wealth data

- `POST /user/upload` 
  - **Description**: Upload files
  - **Request Body**: 
    - Files (multipart/form-data)
  - **Response**: Uploaded file links

### Identity APIs
- `POST /identity/token` 
  - **Description**: Get a new access token using a refresh token
  - **Request Body**: 
    - `refreshToken` (string, required): Valid refresh token
  - **Response**: New access token

- `POST /identity/send-otp` 
  - **Description**: Send an OTP to an email address
  - **Request Body**: 
    - `firstName` (string, required): Recipient's first name
    - `email` (string, required): Recipient's email address
  - **Response**: OTP details

### Company APIs

#### Company Management
- `POST /company/register` 
  - **Description**: Register a new company (automatically becomes company admin)
  - **Request Body**: 
    - `name` (string, required): Company name
    - `logo` (string, optional): Company logo URL
    - `description` (string, optional): Company description
    - `website` (string, optional): Company website URL
    - `industry` (string, optional): Company industry
    - `email` (string, required): Admin email
    - `password` (string, required): Admin password (min 8 chars, must include uppercase, lowercase, number, special char)
    - `otp` (string, required): OTP for verification
    - `otpId` (string, required): OTP identifier
    - `size` (string, optional): Company size (1-10, 11-50, 51-200, 201-500, 501-1000, 1000+)
    - `address` (object, optional): Company address
    - `contactEmail` (string, optional): Contact email
    - `contactPhone` (string, optional): Contact phone
    - `dataAccessPreferences` (object, optional): Data access preferences
  - **Response**: Company and admin details

- `PUT /company/:id` 
  - **Description**: Update a company's information
  - **Authentication**: Required (ADMIN, COMPANY_ADMIN)
  - **Path Parameters**:
    - `id` (string, required): Company ID
  - **Request Body**: Company data to update
  - **Response**: Updated company details

#### Employee Management
- `POST /company/:companyId/employees/invite` 
  - **Description**: Invite an employee to join the company
  - **Authentication**: Required (ADMIN, COMPANY_ADMIN)
  - **Path Parameters**:
    - `companyId` (string, required): Company ID
  - **Request Body**: 
    - `email` (string, required): Employee's email
    - `role` (string, required): Employee's role
    - `firstName` (string, optional): Employee's first name
    - `lastName` (string, optional): Employee's last name
  - **Response**: Employee details

- `GET /company/:companyId/employees` 
  - **Description**: Get all employees of a company
  - **Authentication**: Required (ADMIN, COMPANY_ADMIN)
  - **Path Parameters**:
    - `companyId` (string, required): Company ID
  - **Response**: List of employees

- `DELETE /company/:companyId/employees/:employeeId` 
  - **Description**: Revoke an employee's access
  - **Authentication**: Required (ADMIN, COMPANY_ADMIN)
  - **Path Parameters**:
    - `companyId` (string, required): Company ID
    - `employeeId` (string, required): Employee ID
  - **Response**: Success message

- `GET /company/:companyId/employees/:employeeId/activities` 
  - **Description**: Get employee activities
  - **Authentication**: Required (ADMIN, COMPANY_ADMIN)
  - **Path Parameters**:
    - `companyId` (string, required): Company ID
    - `employeeId` (string, required): Employee ID
  - **Response**: Employee activity logs

### Places APIs
- `GET /places/list-properties` 
  - **Description**: Get a list of properties
  - **Authentication**: Required (ADMIN, COMPANY_ADMIN, EMPLOYEE)
  - **Query Parameters**:
    - `lat` (number, optional): Latitude (default: 40.7589)
    - `long` (number, optional): Longitude (default: -73.9851)
    - `radius` (number, optional): Search radius in miles (default: 5)
    - `page` (number, optional): Page number (default: 1)
    - `listingStatus` (string, optional): Listing status (default: "Sold")
    - `propertyType` (string, optional): Property type
  - **Response**: List of properties

- `GET /places/property/:id` 
  - **Description**: Get details of a specific property
  - **Authentication**: Required (ADMIN, COMPANY_ADMIN, EMPLOYEE)
  - **Path Parameters**:
    - `id` (string, required): Property ID
  - **Response**: Property details

- `GET /places/property-types` 
  - **Description**: Get all property types
  - **Authentication**: Required (ADMIN, COMPANY_ADMIN, EMPLOYEE)
  - **Response**: List of property types
