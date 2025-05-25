export const registerCompanyUrl = '/companies/register'

export const sendOTPUrl = '/identity/send-otp'

export const imageUploadUrl = '/user/upload'

export const placesListUrl = '/places/list-properties'

export const loginUrl = '/user/login'

export const verifyOtpUrl = 'user/verify-otp'

export const getCompanyEmployeesListUrl = (companyId: string) =>
  `/companies/${companyId}/employees`

export const inviteEmployeeUrl = (companyId: string) => {
  return `/companies/${companyId}/employees/invite`
}
