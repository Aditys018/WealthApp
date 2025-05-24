import { EmployeeInvitation } from '@/features/employee-invitation/EmployeeInvitation'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/employeeinvitation')({
  component: EmployeeInvitation,
})

function RouteComponent() {
  return <div>Hello "/employeeinvitation"!</div>
}
