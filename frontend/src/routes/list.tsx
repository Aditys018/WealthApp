import { EmployeeTable } from '@/features'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/list')({
  component: EmployeeTable,
})
