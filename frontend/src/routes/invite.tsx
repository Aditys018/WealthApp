import { EmployeeInvitation } from '@/features/employee-invitation/EmployeeInvitation'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/invite')({
  component: EmployeeInvitation,
})
