import { useQuery } from '@tanstack/react-query'
import { placesService, IPlaceDetailsQuery } from '../../services'

export const usePlaceDetailsQuery = (query: IPlaceDetailsQuery) => {
  const queryKey = ['listPlaces', query]
  return useQuery({
    queryKey,
    queryFn: () => placesService.propertyDetails(query),
  })
}
