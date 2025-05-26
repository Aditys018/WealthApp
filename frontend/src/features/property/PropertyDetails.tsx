import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useParams } from '@tanstack/react-router'
import { usePlaceDetailsQuery } from '@/api'

export function PropertyDetails() {
  const { id } = useParams({ strict: false })
  const {
    data: property,
    isError,
    isLoading,
  } = usePlaceDetailsQuery({
    id: id || '',
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-500 font-semibold">
        Loading property details...
      </div>
    )
  }

  if (isError || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-red-500 font-semibold">
        Failed to load property details.
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 bg-[#262626] text-white rounded-lg space-y-6">
      {/* Outer Container */}
      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 space-y-6">
        {/* Title Section with bottom margin */}
        <div className="space-y-1 mb-8">
          <h1 className="text-4xl font-bold text-[#ff9500]">
            {property.address.streetAddress}
          </h1>
          <p className="text-gray-400">{property.address.streetAddress}</p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-4 gap-6 auto-rows-[minmax(100px,auto)]">
          {/* Basic Summary */}
          <Card className="col-span-2 row-span-2 bg-[#1d1d1d] text-gray-200 border border-[#333]">
            <CardHeader>
              <CardTitle className="text-[#ff9500] text-xl">
                Basic Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed">{property.description}</p>
            </CardContent>
          </Card>

          {/* Owner Details */}
          {/* <Card className="col-span-1 row-span-1 bg-[#1d1d1d] text-gray-200 border border-[#333]">
            <CardHeader>
              <CardTitle className="text-[#ff9500] text-xl">
                Owner Details
              </CardTitle>
            </CardHeader>
            {/* <CardContent className="space-y-1 text-sm">
              <p>
                <strong>Name:</strong> {property.owner.name}
              </p>
              <p>
                <strong>Email:</strong> {property.owner.contact}
              </p>
              <p>
                <strong>Phone:</strong> {property.owner.phone}
              </p>
            </CardContent> */}

          {/* Property Details */}
          <Card className="col-span-2 row-span-1 bg-[#1d1d1d] text-gray-200 border border-[#333]">
            <CardHeader>
              <CardTitle className="text-[#ff9500] text-xl">
                Property Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4 text-sm overflow-scroll">
              {/* <div>
                <strong>Type:</strong> {property.resoFacts.}
              </div> */}
              <div>
                <strong>Year Built:</strong> {property.yearBuilt}
              </div>
              <div>
                <strong>Bedrooms:</strong> {property.resoFacts.bedrooms}
              </div>
              <div>
                <strong>Bathrooms:</strong> {property.resoFacts.bathrooms}
              </div>
              <div>
                <strong>Building Area</strong> {property.resoFacts.buildingArea}{' '}
                sqft
              </div>
              {/* <div>
                <strong>Zoning:</strong> {property.zoning}
              </div> */}
            </CardContent>
          </Card>

          {/* Sale History */}
          <Card className="col-span-2 row-span-1 bg-[#1d1d1d] text-gray-200 border border-[#333] mb-12">
            <CardHeader>
              <CardTitle className="text-[#ff9500] text-xl">
                Sale History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-[#333] text-sm">
                {property.priceHistory.map((entry, index) => (
                  <li key={index} className="py-2 flex justify-between">
                    <span>{entry.date}</span>
                    <span className="font-medium">{entry.price}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Tax Details */}
          <Card className="col-span-2 row-span-1 bg-[#1d1d1d] text-gray-200 border border-[#333] mb-12">
            <CardHeader>
              <CardTitle className="text-[#ff9500] text-xl">
                Tax Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-[#333] text-sm">
                {property.taxHistory.map((entry, index) => (
                  <li key={index} className="py-2 flex justify-between">
                    <span>{new Date(entry.time).toLocaleDateString()}</span>
                    <span className="font-medium">
                      Tax Paid: ${entry.taxPaid || 'N/A'}
                    </span>
                    <span className="font-medium">Value: ${entry.value}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Schools */}
          <Card className="col-span-2 row-span-1 bg-[#1d1d1d] text-gray-200 border border-[#333] mb-12">
            <CardHeader>
              <CardTitle className="text-[#ff9500] text-xl">
                Nearby Schools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-[#333] text-sm">
                {property.schools.map((school, index) => (
                  <li key={index} className="py-2">
                    <p className="font-medium">{school.name}</p>
                    <p>Distance: {school.distance} miles</p>
                    <p>Rating: {school.rating}/10</p>
                    <p>Grades: {school.grades}</p>
                    <a
                      href={school.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline"
                    >
                      View Details
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          {/* Show images */}
          <Card className="col-span-2 row-span-1 bg-[#1d1d1d] text-gray-200 border border-[#333] mb-12">
            <CardHeader>
              <CardTitle className="text-[#ff9500] text-xl">
                Property Images
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {property.originalPhotos.map((image, index) => (
                <img
                  key={index}
                  src={image.mixedSources?.jpeg[0].url}
                  alt={`Property Image ${index + 1}`}
                  className="w-full h-auto rounded-lg"
                />
              ))}
            </CardContent>
          </Card>

          {/* Show images */}
          <Card className="col-span-2 row-span-1 bg-[#1d1d1d] text-gray-200 border border-[#333] mb-12">
            <CardHeader>
              <CardTitle className="text-[#ff9500] text-xl">
                Owner Info
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {property?.ownerInformation?.isListedByOwner ? (
                <div className="text-sm">
                  <p className="font-medium">Listed by Owner</p>
                  <p>
                    <strong>Name:</strong>{' '}
                    {property.ownerInfo.rentalListingContact?.businessName ||
                      'N/A'}
                  </p>

                  <p>
                    <strong>Phone:</strong>{' '}
                    {property.ownerInfo.rentalListingContact?.phoneNumber ||
                      'N/A'}
                  </p>
                </div>
              ) : (
                <div className="text-sm">
                  <p className="font-medium">Listed by Agent</p>

                  <p>
                    <strong>Broker name:</strong>{' '}
                    {property.ownerInfo.forSaleOrSold_ListingContact?.agentName}
                  </p>
                  <p>
                    <strong>Agent License:</strong>{' '}
                    {
                      property.ownerInfo.forSaleOrSold_ListingContact
                        ?.agentLicenseNumber ||
                      'N/A'
                    }
                  </p>
                  <p>
                    <strong>Agent Email:</strong>{' '}
                    {
                      property.ownerInfo.forSaleOrSold_ListingContact
                        ?.agentEmail ||
                      'N/A'
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
