import { useCompanyRegisterMutation } from '@/api'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form' // No need for Controller or zodResolver now

// Import your custom hooks and types

// --- Form Data Type ---
// Define the shape of your form data explicitly.
// This matches your initial form state, but now it's a type for RHF.
interface RegisterCompanyFormData {
  name: string
  sector: string
  email: string
  otp: string
  password: string
  confirmPassword: string
  phone: string
  logo: File | null
  address: {
    street: string
    city: string
    state: string
    country: string
    pincode: string
  }
  dataAccessPreferences: {
    allowEmail: boolean
    allowPhone: boolean
    allowLocation: boolean
  }
}

export function RegisterCompany() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset, // To reset the form
  } = useForm<RegisterCompanyFormData>({
    defaultValues: {
      // Set initial form values
      name: '',
      sector: '',
      email: '',
      otp: '',
      otpId: '',
      password: '',
      confirmPassword: '',
      phone: '',
      logo: null,
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
      },
      dataAccessPreferences: {
        allowEmail: false,
        allowPhone: false,
        allowLocation: false,
      },
    },
    mode: 'onTouched', // Validate on blur/change after first interaction
  })

  // Watch the logo field to create a preview URL
  const logoFile = watch('logo')
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const { mutate } = useCompanyRegisterMutation()

  useEffect(() => {
    if (logoFile instanceof File) {
      const url = URL.createObjectURL(logoFile)
      setLogoPreview(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setLogoPreview(null)
    }
  }, [logoFile])

  // Get password value to compare with confirmPassword for validation
  const password = watch('password')

  const handleSendOtp = async () => {
    const email = watch('email') // Get current email from form
    if (!email) {
      alert('Please enter an email before sending OTP.')
      return
    }
    // You could also trigger email validation here if needed:
    // await trigger('email');
    // if (errors.email) return;
  }

  const handleVerifyOtp = async () => {
    const email = watch('email')
    const otp = watch('otp')
    const otpId = watch('otpId')

    if (!email || !otp || !otpId) {
      alert('Please fill in email, OTP, and make sure OTP is sent.')
      return
    }
  }

  const onSubmit = async (data: RegisterCompanyFormData) => {
    console.log('Form Data for submission:', data)

    // Filter out confirmPassword as it's client-side only
    const { confirmPassword, ...payloadToSend } = data

    mutate(data as any)

    // The logo needs special handling as it's a File and RegisterCompanyPayload expects it
  }

  const inputClass =
    'w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff9500] bg-[#2c2c2c] text-white placeholder-gray-400'
  const labelClass = 'block mb-2 font-semibold text-[#ff9500]'
  const errorClass = 'text-red-500 text-sm mt-1' // Styling for validation errors

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-[#1d1d1d] rounded-lg shadow-lg text-white">
      <h2 className="text-3xl font-bold mb-8 text-center text-[#ff9500]">
        Register Your Company
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Company Info */}
        <div className="grid grid-cols-3 gap-6 items-end">
          {/* Company Name */}
          <div className="col-span-2">
            <label className={labelClass} htmlFor="name">
              Company Name
            </label>
            <input
              id="name"
              {...register('name', { required: 'Company name is required' })} // RHF registration with validation rule
              placeholder="Enter company name"
              className={inputClass}
            />
            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
            {/* Sector below Company Name */}
            <div className="mt-4">
              <label className={labelClass} htmlFor="sector">
                Sector
              </label>
              <input
                id="sector"
                {...register('sector', { required: 'Sector is required' })}
                placeholder="Enter sector"
                className={inputClass}
              />
              {errors.sector && (
                <p className={errorClass}>{errors.sector.message}</p>
              )}
            </div>
          </div>

          {/* Logo Upload on RHS */}
          <div>
            <div>
              <label className={labelClass} htmlFor="logo">
                Upload Logo
              </label>

              <div className="relative border border-gray-600 rounded-md p-4 w-48 h-40 flex items-center justify-center cursor-pointer">
                <input
                  id="logo"
                  type="file"
                  accept="image/*"
                  // Manually handle file input change with RHF's setValue
                  onChange={(e) =>
                    setValue(
                      'logo',
                      e.target.files ? e.target.files[0] : null,
                      { shouldValidate: true },
                    )
                  }
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                />

                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="max-w-full max-h-full object-contain rounded-md"
                  />
                ) : (
                  <span className="text-gray-500 text-center select-none">
                    Click to select an image
                  </span>
                )}
              </div>
              {/* No need to show filename if preview is shown, but keeping for reference */}
              {logoFile && !logoPreview && (
                <p className="mt-1 text-sm text-gray-300">
                  {(logoFile as File).name}
                </p>
              )}
              {/* No direct error for logo here as it's optional */}
            </div>
          </div>
        </div>

        {/* Email & OTP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="md:col-span-2">
            <label className={labelClass} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: 'Invalid email address',
                },
              })}
              placeholder="Enter email"
              className={inputClass}
            />
            {errors.email && (
              <p className={errorClass}>{errors.email.message}</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleSendOtp}
            className="px-4 py-2 rounded-md bg-[#ff9500] text-black font-semibold hover:bg-[#e28500] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send OTP
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="md:col-span-2">
            <label className={labelClass} htmlFor="otp">
              OTP
            </label>
            <input
              id="otp"
              {...register('otp', {
                required: 'OTP is required',
                minLength: { value: 6, message: 'OTP must be 6 digits' },
                maxLength: { value: 6, message: 'OTP must be 6 digits' },
              })}
              placeholder="Enter OTP"
              className={inputClass}
            />
            {errors.otp && <p className={errorClass}>{errors.otp.message}</p>}
            {/* Hidden input for otpId, it's managed by setValue */}
            <input type="hidden" {...register('otpId')} />
          </div>
          <button
            type="button"
            onClick={handleVerifyOtp}
            className="px-4 py-2 rounded-md bg-[#ff9500] text-black font-semibold hover:bg-[#e28500] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Verify OTP
          </button>
        </div>

        {/* Password and Confirm Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
              placeholder="Enter password"
              className={inputClass}
            />
            {errors.password && (
              <p className={errorClass}>{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword', {
                required: 'Confirm password is required',
                validate: (value) =>
                  value === password || 'Passwords do not match', // Custom validation
              })}
              placeholder="Confirm password"
              className={inputClass}
            />
            {errors.confirmPassword && (
              <p className={errorClass}>{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className={labelClass} htmlFor="phone">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone', {
              required: 'Phone number is required',
              minLength: {
                value: 10,
                message: 'Phone number must be at least 10 digits',
              },
              // Add a more robust phone number pattern if needed
            })}
            placeholder="Enter phone number"
            className={inputClass}
          />
          {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
        </div>

        {/* Address */}
        <fieldset className="border border-gray-600 rounded-md p-4 space-y-4">
          <legend className="text-[#ff9500] font-semibold">Address</legend>

          <div>
            <label className={labelClass} htmlFor="address.street">
              Street
            </label>
            <input
              id="address.street"
              {...register('address.street', {
                required: 'Street is required',
              })}
              placeholder="Street"
              className={inputClass}
            />
            {errors.address?.street && (
              <p className={errorClass}>{errors.address.street.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelClass} htmlFor="address.city">
                City
              </label>
              <input
                id="address.city"
                {...register('address.city', { required: 'City is required' })}
                placeholder="City"
                className={inputClass}
              />
              {errors.address?.city && (
                <p className={errorClass}>{errors.address.city.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass} htmlFor="address.state">
                State
              </label>
              <input
                id="address.state"
                {...register('address.state', {
                  required: 'State is required',
                })}
                placeholder="State"
                className={inputClass}
              />
              {errors.address?.state && (
                <p className={errorClass}>{errors.address.state.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass} htmlFor="address.country">
                Country
              </label>
              <input
                id="address.country"
                {...register('address.country', {
                  required: 'Country is required',
                })}
                placeholder="Country"
                className={inputClass}
              />
              {errors.address?.country && (
                <p className={errorClass}>{errors.address.country.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="address.pincode">
              Pincode
            </label>
            <input
              id="address.pincode"
              {...register('address.pincode', {
                required: 'Pincode is required',
              })}
              placeholder="Pincode"
              className={inputClass}
            />
            {errors.address?.pincode && (
              <p className={errorClass}>{errors.address.pincode.message}</p>
            )}
          </div>
        </fieldset>

        {/* Data Access Preferences
         * This section is commented out for now. Uncomment if needed & update text etc accordingly.
         */}
        {/* <fieldset className="border border-gray-600 rounded-md p-4 space-y-4">
          <legend className="text-[#ff9500] font-semibold">
            Data Access Preferences
          </legend>
          <div className="space-y-2">
            <div>
              <input
                type="checkbox"
                id="allowEmail"
                {...register('dataAccessPreferences.allowEmail')} // Handles boolean for checkboxes
                className="mr-2"
              />
              <label htmlFor="allowEmail">Allow Email Access</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="allowPhone"
                {...register('dataAccessPreferences.allowPhone')}
                className="mr-2"
              />
              <label htmlFor="allowPhone">Allow Phone Access</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="allowLocation"
                {...register('dataAccessPreferences.allowLocation')}
                className="mr-2"
              />
              <label htmlFor="allowLocation">Allow Location Access</label>
            </div>
          </div>
        </fieldset> */}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-md bg-[#ff9500] text-black font-bold text-lg hover:bg-[#e28500] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Register Company
        </button>
      </form>
    </div>
  )
}
