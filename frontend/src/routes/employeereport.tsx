import { EmployeeReport } from '@/features/employee-reports/EmployeeReport'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/employeereport')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
    
      <EmployeeReport />
    </>
  )
}