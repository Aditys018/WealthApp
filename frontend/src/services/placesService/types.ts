export interface IPlacesListPayload {
  page: number
  pageSize: number
  lat?: number
  long?: number
  radius?: number
  propertyType?: string
}

/**
 * {
            "id": 221054744,
            "title": "RETAIL STORES (PERSONAL SERVICES, PHOTOGRAPHY, TRAVEL) - Built in 2008",
            "attomId": 221054744,
            "type": "Retail",
            "area": "3,000 sq ft",
            "address": "200 W 47TH ST, NEW YORK, NY 10036",
            "lat": 40.759069,
            "lng": -73.98497
        },
 */
export interface IPlacesListResponse {
  data: {
    id: number
    title: string
    attomId: number
    type: string
    area: string
    address: string
    lat: number
    lng: number
  }[]
  status: boolean
  message: string
}
