import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useParams } from '@tanstack/react-router'
import { samplePropertyDetails as property } from './samplePropertyDetails'

export function PropertyDetails() {
  const { id } = useParams({ strict: false })

  if (!property || property.id !== id) return (
    <div className="min-h-screen flex items-center justify-center text-lg text-red-500 font-semibold">
      Property not found.
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 bg-[#262626] text-white rounded-lg space-y-6">
      {/* Outer Container */}
      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 space-y-6">
        {/* Title Section with bottom margin */}
        <div className="space-y-1 mb-8">
          <h1 className="text-4xl font-bold text-[#ff9500]">{property.title}</h1>
          <p className="text-gray-400">{property.address}</p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-4 gap-6 auto-rows-[minmax(100px,auto)]">
          {/* Basic Summary */}
          <Card className="col-span-1 row-span-1 bg-[#1d1d1d] text-gray-200 border border-[#333]">
            <CardHeader>
              <CardTitle className="text-[#ff9500] text-xl">Basic Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed">{property.summary}</p>
            </CardContent>
          </Card>

          {/* Owner Details */}
          <Card className="col-span-1 row-span-1 bg-[#1d1d1d] text-gray-200 border border-[#333]">
            <CardHeader>
              <CardTitle className="text-[#ff9500] text-xl">Owner Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p><strong>Name:</strong> {property.owner.name}</p>
              <p><strong>Email:</strong> {property.owner.contact}</p>
              <p><strong>Phone:</strong> {property.owner.phone}</p>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card className="col-span-2 row-span-1 bg-[#1d1d1d] text-gray-200 border border-[#333]">
            <CardHeader>
              <CardTitle className="text-[#ff9500] text-xl">Property Details</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
              {Object.entries(property.details).map(([key, val]) => (
                <div key={key}>
                  <span className="font-semibold capitalize">{key}:</span> {val}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Sale History */}
          <Card className="col-span-2 row-span-1 bg-[#1d1d1d] text-gray-200 border border-[#333] mb-12">
            <CardHeader>
              <CardTitle className="text-[#ff9500] text-xl">Sale History</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-[#333] text-sm">
                {property.saleHistory.map((entry, index) => (
                  <li key={index} className="py-2 flex justify-between">
                    <span>{entry.date}</span>
                    <span className="font-medium">{entry.price}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Market Values */}
          <Card className="col-span-2 row-span-1 bg-[#1d1d1d] text-gray-200 border border-[#333] mb-12">
            <CardHeader>
              <CardTitle className="text-[#ff9500] text-xl">Current Market Values</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-1 gap-2 text-sm">
              {Object.entries(property.marketValues).map(([key, val]) => (
                <div key={key}>
                  <strong className="capitalize">{key}:</strong> {val}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
