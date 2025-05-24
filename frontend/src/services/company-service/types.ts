export interface IAddress {
  city: string
  country: string
  state: string
  street: string
  zipCode: string
}

export interface IRegisterCompanyPayload {
  address: IAddress
  name: string
  email: string
  logo: string
  industry: string
  contactPhone: string
  otpId: string
}

export interface IRegisterCompanyResponse {
  data: unknown
  message: string
  status: boolean
}
