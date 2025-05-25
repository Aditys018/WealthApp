import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { useLoginMutation, useVerifyOtpMutation } from '@/api'
import { toast } from 'sonner'
import { useAuth } from '@/context'
import { useNavigate } from '@tanstack/react-router'

type LoginFormValues = {
  email: string
  password: string
  otp: string
}

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
      otp: '',
    },
  })

  const { login } = useAuth()

  const [showOtp, setShowOtp] = useState(false)
  const [otpId, setOtpId] = useState('')

  const { mutate, isPending } = useLoginMutation()
  const {
    mutate: verifyOtp,
    data,
    isPending: isOtpPending,
  } = useVerifyOtpMutation()
  const navigate = useNavigate()

  const onSubmit = (data: LoginFormValues) => {
    const { otp, ...rest } = data
    mutate(rest, {
      onSuccess: (data) => {
        toast.success(data.message)
        setOtpId(data.data.id)
        setShowOtp(true)
      },
      onError: (error) => {
        toast.error(error.message || 'Account not found')
      },
    })
  }

  const handleOtpSubmit = () => {
    const otpValue = watch('otp')
    console.log('OTP Submitted:', otpValue)

    verifyOtp(
      {
        email: watch('email'),
        otp: otpValue,
        otpId,
      },
      {
        onSuccess: (res) => {
          toast.success(res.message)
          login(res.data.user, res.data.tokens)
          if (res.data.user.passwordResetRequired) {
            navigate({ to: '/reset', replace: true })
          } else if (
            res.data.user.role === 'ADMIN' ||
            res.data.user.role === 'COMPANY_ADMIN'
          ) {
            navigate({ to: '/dashboard', replace: true })
          } else {
            navigate({ to: '/maps', replace: true })
          }
        },
      },
    )
    // setShowOtp(false)
    reset()
  }

  return (
    <div className="flex items-center justify-center px-4 py-20">
      {!showOtp ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-6 border rounded-xl bg-secondary text-accent shadow-md px-6 py-8 md:p-10"
        >
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-accent text-white hover:bg-accent/90"
          >
            {isPending ? 'Sending OTP...' : 'Login'}
          </Button>
        </form>
      ) : (
        <Card className="w-full max-w-md space-y-6 border rounded-xl bg-secondary text-accent shadow-md px-6 py-8 md:p-10">
          <div className="space-y-1">
            <Label htmlFor="otp">Enter OTP</Label>
            <Input
              id="otp"
              type="text"
              placeholder="123456"
              maxLength={6}
              {...register('otp', {
                required: 'OTP is required',
                maxLength: {
                  value: 6,
                  message: 'OTP must be 6 digits',
                },
              })}
            />
            {errors.otp && (
              <p className="text-red-500 text-sm">{errors.otp.message}</p>
            )}
          </div>

          <Button
            onClick={handleOtpSubmit}
            className="w-full bg-accent text-white hover:bg-accent/90"
          >
            Verify
          </Button>
        </Card>
      )}
    </div>
  )
}
