import { useListPlacesQuery } from '@/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
} from '@react-google-maps/api'
import { Bath, Bed, Eye, MapPin, Square } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'

// Map container style
const containerStyle = {
  width: '100%',
  height: '100vh',
  borderRadius: '12px',
}

// Default center (Times Square, NYC)
const center = {
  lat: 36.778259,
  lng: -119.417931,
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
      elementType: 'geometry',
      stylers: [{ color: '#212121' }],
    },
    {
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [{ color: '#757575' }],
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#000000' }],
    },
    {
      featureType: 'administrative',
      elementType: 'geometry',
      stylers: [{ color: '#757575' }],
    },
    {
      featureType: 'administrative.country',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#ffffff' }],
    },
    {
      featureType: 'administrative.land_parcel',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#ffffff' }],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#ffffff' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#181818' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#616161' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#1b1b1b' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry.fill',
      stylers: [{ color: '#2c2c2c' }],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#ffffff' }],
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry',
      stylers: [{ color: '#373737' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#3c3c3c' }],
    },
    {
      featureType: 'road.highway.controlled_access',
      elementType: 'geometry',
      stylers: [{ color: '#4e4e4e' }],
    },
    {
      featureType: 'road.local',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#ffffff' }],
    },
    {
      featureType: 'transit',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#ffffff' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#000000' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#ffffff' }],
    },
  ],
}

const PropertyMap = () => {
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [map, setMap] = useState(null)
  const [mapCenter, setMapCenter] = useState(center)
  const [radius, setRadius] = useState(5) // Default radius in km
  const [listing_status, setListingStatus] = useState('For Sale')
  const [propertyType, setPropertyType] = useState('Houses')
  const [isProgrammaticMove, setIsProgrammaticMove] = useState(false)
  const navigate = useNavigate()

  // Memoize the query parameters to prevent unnecessary re-renders
  const queryParams = useMemo(
    () => ({
      lat: mapCenter.lat,
      long: mapCenter.lng,
      radius, // 5 km radius
      page: 1,
      pageSize: 20,
      propertyType,
      listing_status,
    }),
    [mapCenter.lat, mapCenter.lng, radius, listing_status, propertyType],
  )

  const { data, isError, isLoading } = useListPlacesQuery(queryParams)

  const onLoad = useCallback((map) => {
    setMap(map)
  }, [])

  const inputRef = useRef(null)

  const initAutocomplete = useCallback(() => {
    if (!window.google || !inputRef.current) return

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        fields: ['geometry'],
        types: ['geocode'], // or 'establishment' depending on your use case
      },
    )

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (!place.geometry) return

      const location = place.geometry.location
      const lat = location?.lat()
      const lng = location?.lng()

      // Pan and zoom to the selected place
      map?.panTo({ lat, lng })
      map?.setZoom(16)
    })
  }, [map])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  const handleInfoWindowClose = () => {
    setSelectedProperty(null)
  }

  // Simplified handlePropertyClick - only sets selected property
  const handlePropertyClick = useCallback((property) => {
    setSelectedProperty(property)
    setIsProgrammaticMove(true)
    // Optionally pan to the property
    // map?.panTo({ lat: property.lat, lng: property.lng })
    // map?.setZoom(16)
  }, [])

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

  const googleMapsRef = useRef(null)

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
  const handleRouteToDetails = (propertyId: string) => {
    console.log('Navigating to property details for:', propertyId)
    navigate({
      to: '/details/$id',
      params: { id: propertyId },
    })
  }

  // Debounced map idle handler to prevent excessive API calls
  const handleMapIdle = useCallback(() => {
    if (map && !isProgrammaticMove) {
      console.log('Map is idle, fetching center and bounds...')

      const newCenter = map.getCenter()
      const centerJson = newCenter.toJSON()

      // Only update if the center has actually changed significantly
      const threshold = 0.001 // Adjust this threshold as needed
      if (
        Math.abs(centerJson.lat - mapCenter.lat) > threshold ||
        Math.abs(centerJson.lng - mapCenter.lng) > threshold
      ) {
        setMapCenter(centerJson)
      }

      const bounds = map.getBounds()
      const zoom = map.getZoom()

      console.log('Current Zoom Level:', zoom)
      console.log('Map Bounds:', {
        northEast: bounds.getNorthEast().toJSON(),
        southWest: bounds.getSouthWest().toJSON(),
      })
      console.log('Map Center:', centerJson)

      if (newCenter && bounds && window.google) {
        const ne = bounds.getNorthEast()
        const radius =
          window.google.maps.geometry.spherical.computeDistanceBetween(
            newCenter,
            ne,
          )
        console.log('Approx. Radius (meters):', radius)
        setRadius(radius / 1000) // Convert to kilometers
      }
    } else if (isProgrammaticMove) {
      console.log('Map was moved programmatically, skipping center update.')
      setIsProgrammaticMove(false)
    }
  }, [map, mapCenter.lat, mapCenter.lng, isProgrammaticMove])

  useEffect(() => {
    if (map) {
      initAutocomplete()
    }
  }, [map, initAutocomplete])

  return (
    <div className="relative w-full h-full">
      <LoadScript
        libraries={['geometry', 'places']}
        googleMapsApiKey="AIzaSyCOTKgJdgCv_nu989DjZjpej0pv9dLBfs4"
      >
        <div className="flex gap-2 mb-4 mt-4">
          <input
            ref={inputRef}
            id="search-box"
            type="text"
            placeholder="Search for a location..."
            className="z-10 w-96 p-2 rounded-md shadow-md
             bg-white border border-gray-300 focus:outline-none focus:ring-2
              focus:ring-gray-100 ml-100"
          />

          <select
            className="p-2 rounded-md shadow-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
            placeholder="Property Type"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="house">Houses</option>
            <option value="apartment">Apartments</option>
            <option value="condo">Multi-family</option>
            <option value="townhouse">Condos/Co-ops</option>
            <option value="nursery">Lots/Land</option>
            <option value="greenhouse">Greenhouse</option>
            <option value="ployhouse">Townhomes</option>
          </select>

          <select
            className="p-2 rounded-md shadow-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
            placeholder="Listing Status"
            value={listing_status}
            onChange={(e) => setListingStatus(e.target.value)}
          >
            <option value="">Sold</option>
            <option value="house">For_Sale</option>
            <option value="apartment">For_Rent</option>
            
          </select>
        </div>

        <div className="relative">
          <GoogleMap
            ref={googleMapsRef}
            mapContainerStyle={containerStyle}
            mapContainerClassName="rounded-xl shadow-lg"
            center={center}
            zoom={14}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={options}
            onIdle={handleMapIdle}
          >
            {data?.data.map((property) => (
              <Marker
                key={property.id}
                position={{ lat: property.lat, lng: property.lng }}
                onClick={() => handlePropertyClick(property)}
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
                      src={selectedProperty.bannerImage}
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
                        handleRouteToDetails(selectedProperty.id)
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

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-xl">
              <div className="bg-[#262626] p-4 rounded-lg shadow-lg flex items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#ff9500]"></div>
                <span className="text-white">Loading properties...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-xl">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <span className="text-red-600">
                  Error loading properties. Please try again.
                </span>
              </div>
            </div>
          )}
        </div>
      </LoadScript>
    </div>
  )
}

export default PropertyMap
