export interface ILogoUploadPayload {
  file: File
}

export interface ILogoUploadResponse {
  link: string
  message: string
}

export interface ILoginPayload {
  email: string
  password: string
}

export interface ILoginResponse {
  message: string
  status: boolean
  data: {
    id: string
    expiresAt: string
  }
}

export interface IVerifyLoginOtpPayload {
  otp: string
  otpId: string
  email: string
}

export interface IVerifyLoginOtpResponse {
  message: string
  status: boolean
  data: {
    tokens: {
      accessToken: string
      refreshToken: string
    }
    user: {
      company: {
        companyId: string
        companyName: string
        invitedBy: string
      }
      _id: string
      email: string
      role: string
      passwordResetRequired: boolean
    }
  }
}

export interface IResetPasswordPayload {
  oldPassword: string
  newPassword: string
}

export interface IResetPasswordResponse {
  message: string
  status: boolean
  data: unknown
}
