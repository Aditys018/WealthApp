import { useQuery } from '@tanstack/react-query'
import {
  placesService,
  IPlacesListResponse,
  IPlacesListPayload
} from '../../services'
import { AxiosError } from 'axios'

export const useListPlacesQuery = (query: IPlacesListPayload) => {
  const queryKey = ['listPlaces', query]
  return useQuery({
    queryKey,
    queryFn: () => placesService.listProperties(query),
  })
}
