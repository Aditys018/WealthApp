import React, { useState, useCallback, useRef } from 'react'
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from '@react-google-maps/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Bed, Bath, Square, Eye } from 'lucide-react'

// Sample property data
const sampleProperties = [
  {
    id: 1,
    title: 'Modern Downtown Apartment',
    price: '$450,000',
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: '1,200 sq ft',
    address: '123 Main St, Downtown',
    lat: 40.7589,
    lng: -73.9851,
    image: '/api/placeholder/300/200',
    status: 'For Sale',
  },
  {
    id: 2,
    title: 'Suburban Family Home',
    price: '$650,000',
    type: 'House',
    bedrooms: 4,
    bathrooms: 3,
    area: '2,500 sq ft',
    address: '456 Oak Avenue, Suburbs',
    lat: 40.7505,
    lng: -73.9934,
    image: '/api/placeholder/300/200',
    status: 'For Sale',
  },
  {
    id: 3,
    title: 'Luxury Penthouse',
    price: '$1,200,000',
    type: 'Penthouse',
    bedrooms: 3,
    bathrooms: 3,
    area: '1,800 sq ft',
    address: '789 Park Place, Uptown',
    lat: 40.768,
    lng: -73.982,
    image: '/api/placeholder/300/200',
    status: 'Featured',
  },
  {
    id: 4,
    title: 'Cozy Studio Loft',
    price: '$320,000',
    type: 'Studio',
    bedrooms: 1,
    bathrooms: 1,
    area: '800 sq ft',
    address: '321 Artist Lane, Creative District',
    lat: 40.7614,
    lng: -73.9776,
    image: '/api/placeholder/300/200',
    status: 'For Sale',
  },
]

// Map container style
const containerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '12px',
}

// Default center (Times Square, NYC)
const center = {
  lat: 40.7589,
  lng: -73.9851,
}

// Map options for better UX
const options = {
  disableDefaultUI: false,
  zoomControl: true,
  scrollwheel: true,
  disableDoubleClickZoom: false,
  mapTypeControl: true,
  streetViewControl: true,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
}

const PropertyMap = ({ googleApiKey }) => {
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [map, setMap] = useState(null)

  const onLoad = useCallback((map) => {
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  const handleMarkerClick = (property) => {
    setSelectedProperty(property)
  }

  const handleInfoWindowClose = () => {
    setSelectedProperty(null)
  }

  const handlePropertyClick = (property) => {
    setSelectedProperty(property)
    map?.panTo({ lat: property.lat, lng: property.lng })
    map?.setZoom(15)
  }

  // Custom marker icon for properties
  const propertyIcon = {
    url:
      'data:image/svg+xml;charset=UTF-8,' +
      encodeURIComponent(`
      <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.16 0 0 7.16 0 16C0 28 16 40 16 40S32 28 32 16C32 7.16 24.84 0 16 0Z" fill="#dc2626"/>
        <circle cx="16" cy="16" r="8" fill="white"/>
        <text x="16" y="20" text-anchor="middle" fill="#dc2626" font-family="Arial" font-size="12" font-weight="bold">$</text>
      </svg>
    `),
    scaledSize: { width: 32, height: 40 },
  }
  const googleMapsRef = useRef<GoogleMap>(null);
  console.log('googleMapsRef', googleMapsRef.current);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Featured':
        return 'default'
      case 'For Sale':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const handleMapIdle = useCallback(() => {
    if (map) {
      console.log('Map is idle, fetching center and bounds...')
      const center = map.getCenter()
      const bounds = map.getBounds()

      const zoom = map.getZoom()
      console.log('Current Zoom Level:', zoom);

      // calculate the approximate radius based on the center and bounds
      console.log('Map Bounds:', {
        northEast: bounds.getNorthEast().toJSON(),
        southWest: bounds.getSouthWest().toJSON(),
      })
      console.log('Map Center:', center.toJSON())
      console.log('Map Zoom Level:', zoom)
      // If you need to calculate the radius, you can use the center and bounds
      // const radius = window.google.maps.geometry.spherical.computeDistanceBetween(
      //   center,
      //   bounds.getNorthEast()
      // )
  
      if (center && bounds) {
        const ne = bounds.getNorthEast()

        if (window.google) {
          console.log('Google Maps Geometry library is loaded.')
          console.log('Calculating radius...')
          console.log(window.google.maps.geometry)
        }
  
        const radius = window.google.maps.geometry.spherical.computeDistanceBetween(
          center,
          ne
        )
  
        console.log('Map Center:', {
          lat: center.lat(),
          lng: center.lng(),
        })
        console.log('Approx. Radius (meters):', radius)
      }
    }
  }, [map])

  return (
    <div className="relative w-full h-full">
      <LoadScript libraries={['geometry']} googleMapsApiKey="AIzaSyCOTKgJdgCv_nu989DjZjpej0pv9dLBfs4">
        <GoogleMap
          ref={googleMapsRef}
          // onBoundsChanged={onBoundsChanged}
          mapContainerStyle={containerStyle}
          mapContainerClassName="rounded-xl shadow-lg"
          center={center}
          zoom={13}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={options}
          onIdle={handleMapIdle}
        >
          {sampleProperties.map((property) => (
            <Marker
              key={property.id}
              position={{ lat: property.lat, lng: property.lng }}
              onClick={() => handleMarkerClick(property)}
              icon={propertyIcon}
              title={property.title}
            />
          ))}

          {selectedProperty && (
            <InfoWindow
              position={{
                lat: selectedProperty.lat,
                lng: selectedProperty.lng,
              }}
              onCloseClick={handleInfoWindowClose}
            >
              <div className="max-w-sm p-0 m-0">
                <div className="relative">
                  <img
                    src={selectedProperty.image}
                    alt={selectedProperty.title}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <Badge
                    variant={getStatusBadgeVariant(selectedProperty.status)}
                    className="absolute top-2 right-2"
                  >
                    {selectedProperty.status}
                  </Badge>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {selectedProperty.title}
                  </h3>
                  <p className="text-xl font-bold text-red-600 mb-2">
                    {selectedProperty.price}
                  </p>
                  <div className="space-y-1 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">
                        {selectedProperty.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Bed className="w-3 h-3" />
                        <span>{selectedProperty.bedrooms}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="w-3 h-3" />
                        <span>{selectedProperty.bathrooms}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Square className="w-3 h-3" />
                        <span>{selectedProperty.area}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{selectedProperty.address}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      console.log(
                        'View details for property:',
                        selectedProperty.id,
                      )
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>

      {/* Property list sidebar */}
      <Card className="absolute top-4 left-4 w-80 max-h-96 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Properties ({sampleProperties.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-80 overflow-y-auto">
            {sampleProperties.map((property) => (
              <div
                key={property.id}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedProperty?.id === property.id
                    ? 'bg-blue-50 border-l-4 border-l-blue-500'
                    : ''
                }`}
                onClick={() => handlePropertyClick(property)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm text-gray-900 line-clamp-1">
                    {property.title}
                  </h4>
                  <Badge
                    variant={getStatusBadgeVariant(property.status)}
                    className="text-xs ml-2"
                  >
                    {property.status}
                  </Badge>
                </div>
                <p className="text-lg font-semibold text-red-600 mb-1">
                  {property.price}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Bed className="w-3 h-3" />
                    {property.bedrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="w-3 h-3" />
                    {property.bathrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Square className="w-3 h-3" />
                    {property.area}
                  </span>
                </div>
                <Badge variant="outline" className="mt-2 text-xs">
                  {property.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PropertyMap
