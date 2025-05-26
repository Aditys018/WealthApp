import { axiosClient, placesListUrl, propertyDetailsUrl } from '@/api'
import {
  IPlacesListPayload,
  IPlacesListResponse,
  IPlaceDetailsQuery,
  IPropertyDetailsResponse,
  IPropertyDetails,
} from './types'

export const placesService = {
  listProperties: async (
    query: IPlacesListPayload,
  ): Promise<IPlacesListResponse> => {
    try {
      const response = await axiosClient.get<IPlacesListResponse>(
        placesListUrl,
        {
          params: query,
        },
      )

      console.log('List of properties:', response.data)

      return response.data
    } catch (error) {
      console.error('Error registering company:', error)

      throw error
    }
  },
  propertyDetails: async (
    query: IPlaceDetailsQuery,
  ): Promise<IPropertyDetails> => {
    try {
      const response = await axiosClient.get<IPropertyDetailsResponse>(
        propertyDetailsUrl(query.id),
      )

      console.log('Property Details:', response.data)

      return response.data.data
    } catch (error) {
      console.error('Error registering company:', error)

      throw error
    }
  },
}
