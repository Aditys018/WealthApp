import { createFileRoute } from '@tanstack/react-router'
import { RegisterCompany } from '@/features'

export const Route = createFileRoute('/register')({
  component: () => <RegisterCompany />,
})
