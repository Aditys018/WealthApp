export interface ISendOtpPayload {
  email: string
  firstName: string
}

export interface ISendOtpResponse {
  data: {
    expiresAt: string
    id: string
  }
  status: boolean
  message: string
}
