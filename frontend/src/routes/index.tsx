import { createFileRoute } from '@tanstack/react-router'
import { LandingPage } from '@/features'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="text-center">
      <LandingPage />
    </div>
  )
}
