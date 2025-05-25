import { useCompanyEmployeesListQuery } from '@/api'
import { AdminDashboard } from '@/features'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
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
