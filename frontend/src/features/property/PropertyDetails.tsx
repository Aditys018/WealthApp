// PropertyDetails.tsx
import { useParams } from '@tanstack/react-router'
import { samplePropertyDetails as property } from './samplePropertyDetails'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function PropertyDetails() {
  const { id } = useParams({ strict: false })

  // In real case, fetch using ID
  if (!property || property.id !== id) return <div>Property not found.</div>

  return (
    <div className="max-w-4xl text-accent mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{property.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{property.address}</p>
        </CardHeader>
        <img
          src={property.image}
          alt={property.title}
          className="rounded-b-lg w-full h-64 object-cover"
        />
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Basic Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{property.summary}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Owner Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p>
            <strong>Name:</strong> {property.owner.name}
          </p>
          <p>
            <strong>Email:</strong> {property.owner.contact}
          </p>
          <p>
            <strong>Phone:</strong> {property.owner.phone}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {Object.entries(property.details).map(([key, val]) => (
            <p key={key}>
              <strong>{key}:</strong> {val}
            </p>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sale History</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {property.saleHistory.map((entry, index) => (
              <li key={index} className="flex justify-between">
                <span>{entry.date}</span>
                <span>{entry.price}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Market Values</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {Object.entries(property.marketValues).map(([key, val]) => (
            <p key={key}>
              <strong>{key}:</strong> {val}
            </p>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
