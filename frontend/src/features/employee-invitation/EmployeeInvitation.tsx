import { useEmployeeInviteMutation } from '@/api'
import { useAuth } from '@/context'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface EmployeeInvitationFormData {
  email: string
  role: 'EMPLOYEE' | 'ADMIN'
  firstName: string
  lastName: string
}

export const EmployeeInvitation = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  // @ts-ignore
  const companyId = user?.company?.companyId || ''
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeInvitationFormData>({
    defaultValues: {
      email: '',
      role: 'EMPLOYEE',
      firstName: '',
      lastName: '',
    },
  })

  const { mutate, isPending } = useEmployeeInviteMutation(companyId)

  const onSubmit = async (data: EmployeeInvitationFormData) => {
    // @ts-ignore
    mutate(data, {
      onSuccess: (data) => {
        console.log('Employee invited successfully:', data)
        toast.success('Employee invited successfully!')
        navigate({ to: '/dashboard' })
      },
      onError: (error) => {
        console.error('Error inviting employee:', error)
        toast.error(error?.message || 'Failed to invite employee.')
      },
    })
  }

  const inputClass =
    'w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff9500] bg-[#2c2c2c] text-white placeholder-gray-400'
  const labelClass = 'block mb-2 font-semibold text-[#ff9500]'
  const errorClass = 'text-red-500 text-sm mt-1'

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-[#1d1d1d] rounded-lg shadow-lg text-white">
      <h2 className="text-3xl font-bold mb-8 text-center text-[#ff9500]">
        Invite Employee
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass} htmlFor="firstName">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              {...register('firstName', {
                required: 'First name is required',
              })}
              placeholder="Enter first name"
              className={inputClass}
            />
            {errors.firstName && (
              <p className={errorClass}>{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="lastName">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              {...register('lastName', {
                required: 'Last name is required',
              })}
              placeholder="Enter last name"
              className={inputClass}
            />
            {errors.lastName && (
              <p className={errorClass}>{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              placeholder="Enter email address"
              className={inputClass}
            />
            {errors.email && (
              <p className={errorClass}>{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="role">
              Role
            </label>
            <select
              id="role"
              {...register('role', {
                required: 'Role is required',
              })}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
            </select>
            {errors.role && <p className={errorClass}>{errors.role.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#ff9500] hover:bg-[#e28500] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff9500] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isPending ? 'Sending...' : 'Send Invitation'}
        </button>
      </form>
    </div>
  )
}
