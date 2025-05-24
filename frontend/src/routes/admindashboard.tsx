import { AdminDashboard } from '@/features/admin-dashboard/AdminDashboard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admindashboard')({
  component: AdminDashboard,
})

function RouteComponent() {
  return <div>Hello "/admindashboard"!</div>
}
