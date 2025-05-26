'use client'

import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useResetPasswordMutation } from '@/api'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'

type ResetPasswordFormValues = {
  oldPassword: string
  newPassword: string
}

export function ResetPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
    },
  })
  const navigate = useNavigate()

  const { mutate } = useResetPasswordMutation()

  const onSubmit = (data: ResetPasswordFormValues) => {
    console.log('🔐 Resetting password with:', data)
    mutate(data, {
      onSuccess: (res) => {
        toast.success(res.message || 'Password updated successfully')
        navigate({ to: '/maps' })
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to update password')
      },
    })
  }

  return (
    <div className="max-w-md mx-auto mt-20 text-accent bg-secondary p-6 border rounded-xl shadow-sm ">
      <h2 className="text-xl font-semibold mb-6">Reset Password</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Old Password */}
        <div className="space-y-1">
          <Label htmlFor="oldPassword">Old Password</Label>
          <Input
            id="oldPassword"
            type="password"
            placeholder="Enter old password"
            {...register('oldPassword', {
              required: 'Old password is required',
              minLength: {
                value: 6,
                message: 'Must be at least 6 characters',
              },
            })}
          />
          {errors.oldPassword && (
            <p className="text-sm text-red-600">{errors.oldPassword.message}</p>
          )}
        </div>

        {/* New Password */}
        <div className="space-y-1">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Enter new password"
            {...register('newPassword', {
              required: 'New password is required',
              minLength: {
                value: 6,
                message: 'Must be at least 6 characters',
              },
            })}
          />
          {errors.newPassword && (
            <p className="text-sm text-red-600">{errors.newPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Update Password
        </Button>
      </form>
    </div>
  )
}
