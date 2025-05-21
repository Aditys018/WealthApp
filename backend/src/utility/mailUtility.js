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
 * @param {number} length Length of the OTP code
 * @returns {string} Random OTP code
 */
export const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let OTP = '';

  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }

  return OTP;
};

/**
 * Send a registration confirmation email
 * @param {string} to Recipient email address
 * @param {string} firstName First name of the recipient
 * @returns {Promise<any>} Promise resolving to the sent message info
 */
export const sendRegistrationEmail = async (to, firstName) => {
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
 * @param {string} to Recipient email address
 * @param {string} firstName First name of the recipient
 * @param {string} otp OTP code
 * @returns {Promise<any>} Promise resolving to the sent message info
 */
export const sendLoginOTPEmail = async (to, firstName, otp) => {
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
 * @param {string} email User's email address
 * @param {string} firstName User's first name
 * @returns {Promise<{otp: string, expiresAt: Date}>} Generated OTP code and its expiration time
 */
export const createAndSendOTP = async (email, firstName) => {
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
 * @param {string} providedOTP OTP provided by the user
 * @param {string} storedOTP OTP stored in the database
 * @param {Date} expiresAt Expiration time of the OTP
 * @returns {boolean} Boolean indicating if the OTP is valid
 */
export const verifyOTP = (providedOTP, storedOTP, expiresAt) => {
  const now = new Date();

  if (now > expiresAt) {
    return false; // OTP has expired
  }

  return providedOTP === storedOTP;
};

/**
 * Generate a secure random password
 * @param {number} length Length of the password
 * @returns {string} Secure random password
 */
export const generateSecurePassword = (length = 12) => {
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
 * @param {string} to Recipient email address
 * @param {string} firstName First name of the recipient (or email if name not available)
 * @param {string} companyName Name of the company
 * @param {string} temporaryPassword Temporary password for the new account
 * @param {string} inviterName Name of the person who sent the invitation
 * @returns {Promise<any>} Promise resolving to the sent message info
 */
export const sendEmployeeInvitationEmail = async (
  to, 
  firstName, 
  companyName, 
  temporaryPassword,
  inviterName
) => {
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
