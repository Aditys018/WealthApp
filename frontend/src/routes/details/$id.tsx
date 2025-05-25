import { PropertyDetails } from '@/features/property/PropertyDetails'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/details/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <PropertyDetails />
    </div>
  )
}
