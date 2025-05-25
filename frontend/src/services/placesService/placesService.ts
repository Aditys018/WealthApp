import { axiosClient, placesListUrl } from '@/api'
import { IPlacesListPayload, IPlacesListResponse } from './types'

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
}
