import { useCompanyEmployeesListQuery } from '@/api'
import { AdminDashboard } from '@/features'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null')

    const allowedRoles = ['ADMIN', 'COMPANY_ADMIN']

    if (!user || !allowedRoles.includes(user.role)) {
      throw redirect({ to: '/maps' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useCompanyEmployeesListQuery('682efb734f58e57864d0de0e')
  console.log('Company Employees Data:', data)

  return (
    <div>
      <AdminDashboard />
    </div>
  )
}
