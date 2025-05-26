import PropertyMap from '@/features/map/MapView'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/maps')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      {/* <PropertyMap googleApiKey="c761ec3633c22afad934f-b17a66385c1c06c5472b4898b866b7306186d0bb477" /> */}
      <PropertyMap />
    </div>
  )
}
