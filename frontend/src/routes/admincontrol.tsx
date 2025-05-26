import { AdminControl } from '@/features/admin-control/AdminControl'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admincontrol')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <AdminControl />
    </>
  )
}