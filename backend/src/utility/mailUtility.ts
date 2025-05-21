import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Generate a random OTP code
 * @param length Length of the OTP code
 * @returns Random OTP code
 */
export const generateOTP = (length: number = 6): string => {
  const digits = '0123456789';
  let OTP = '';

  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }

  return OTP;
};

/**
 * Send a registration confirmation email
 * @param to Recipient email address
 * @param firstName First name of the recipient
 * @returns Promise resolving to the sent message info
 */
export const sendRegistrationEmail = async (to: string, firstName: string): Promise<any> => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@wealthapp.com',
    to,
    subject: 'Welcome to WealthApp - Registration Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to WealthApp!</h2>
        <p>Hello ${firstName},</p>
        <p>Thank you for registering with WealthApp. Your account has been created successfully.</p>
        <p>You can now log in to your account and start managing your wealth.</p>
        <p>Best regards,</p>
        <p>The WealthApp Team</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Registration email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending registration email:', error);
    throw error;
  }
};

/**
 * Send an OTP email for login verification
 * @param to Recipient email address
 * @param firstName First name of the recipient
 * @param otp OTP code
 * @returns Promise resolving to the sent message info
 */
export const sendLoginOTPEmail = async (to: string, firstName: string, otp: string): Promise<any> => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@wealthapp.com',
    to,
    subject: 'WealthApp - Login Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Login Verification</h2>
        <p>Hello ${firstName},</p>
        <p>Your verification code for logging into WealthApp is:</p>
        <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not request this code, please ignore this email or contact support if you believe this is suspicious activity.</p>
        <p>Best regards,</p>
        <p>The WealthApp Team</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Login OTP email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending login OTP email:', error);
    throw error;
  }
};

/**
 * Create and send an OTP for user verification
 * @param email User's email address
 * @param firstName User's first name
 * @returns Generated OTP code and its expiration time
 */
export const createAndSendOTP = async (email: string, firstName: string): Promise<{ otp: string, expiresAt: Date }> => {
  const otp = generateOTP();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP expires in 10 minutes

  await sendLoginOTPEmail(email, firstName, otp);

  return {
    otp,
    expiresAt
  };
};

/**
 * Verify if the provided OTP is valid and not expired
 * @param providedOTP OTP provided by the user
 * @param storedOTP OTP stored in the database
 * @param expiresAt Expiration time of the OTP
 * @returns Boolean indicating if the OTP is valid
 */
export const verifyOTP = (providedOTP: string, storedOTP: string, expiresAt: Date): boolean => {
  const now = new Date();

  if (now > expiresAt) {
    return false; // OTP has expired
  }

  return providedOTP === storedOTP;
};

/**
 * Generate a secure random password
 * @param length Length of the password
 * @returns Secure random password
 */
export const generateSecurePassword = (length: number = 12): string => {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const specialChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';

  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;

  // Ensure at least one character from each category
  let password = '';
  password += uppercaseChars.charAt(Math.floor(crypto.randomInt(uppercaseChars.length)));
  password += lowercaseChars.charAt(Math.floor(crypto.randomInt(lowercaseChars.length)));
  password += numberChars.charAt(Math.floor(crypto.randomInt(numberChars.length)));
  password += specialChars.charAt(Math.floor(crypto.randomInt(specialChars.length)));

  // Fill the rest of the password
  for (let i = 4; i < length; i++) {
    password += allChars.charAt(Math.floor(crypto.randomInt(allChars.length)));
  }

  // Shuffle the password characters
  return password.split('').sort(() => 0.5 - Math.random()).join('');
};

/**
 * Send an employee invitation email
 * @param to Recipient email address
 * @param firstName First name of the recipient (or email if name not available)
 * @param companyName Name of the company
 * @param temporaryPassword Temporary password for the new account
 * @param inviterName Name of the person who sent the invitation
 * @returns Promise resolving to the sent message info
 */
export const sendEmployeeInvitationEmail = async (
  to: string, 
  firstName: string, 
  companyName: string, 
  temporaryPassword: string,
  inviterName: string
): Promise<any> => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@wealthapp.com',
    to,
    subject: `Invitation to join ${companyName} on WealthApp`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to ${companyName} on WealthApp!</h2>
        <p>Hello ${firstName},</p>
        <p>You have been invited by ${inviterName} to join ${companyName} on WealthApp.</p>

        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>Getting Started</h3>
          <p>Here are your temporary login credentials:</p>
          <p><strong>Email:</strong> ${to}</p>
          <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>
          <p><em>You will be required to change this password on your first login.</em></p>
        </div>

        <h3>Next Steps:</h3>
        <ol>
          <li><strong>Login with your temporary password</strong> - You'll be prompted to create a new secure password</li>
          <li><strong>Set up multi-factor authentication</strong> - For enhanced security of your account</li>
          <li><strong>Review and accept the terms of service</strong> - Required to use the platform</li>
          <li><strong>Complete the onboarding tutorial</strong> - Learn how to use the platform effectively</li>
          <li><strong>Set your notification preferences</strong> - Choose how you want to be informed</li>
        </ol>

        <p>For security reasons, this invitation will expire in 7 days.</p>

        <p>If you have any questions, please contact your company administrator.</p>

        <p>Best regards,</p>
        <p>The WealthApp Team</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Employee invitation email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending employee invitation email:', error);
    throw error;
  }
};
