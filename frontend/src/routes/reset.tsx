import { ResetPasswordForm } from '@/features'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/reset')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <ResetPasswordForm />
    </div>
  )
}
