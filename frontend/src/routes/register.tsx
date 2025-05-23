import { createFileRoute } from '@tanstack/react-router'
import RegisterCompany from '../components/RegisterCompany'

export const Route = createFileRoute('/register')({
  component: () => <RegisterCompany />,
})
