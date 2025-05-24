import { useQuery } from '@tanstack/react-query'
import {
  placesService,
  IPlacesListResponse,
  IPlacesListPayload
} from '../../services'
import { AxiosError } from 'axios'

export const useListPlacesQuery = () => {
  return useQuery({
    queryKey: ['listPlaces'],
    queryFn: placesService.listProperties,
  })
}
