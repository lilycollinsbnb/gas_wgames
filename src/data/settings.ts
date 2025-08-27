import type { Settings } from '@/types'
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions
} from 'react-query'
import client from './client'
import { API_ENDPOINTS } from './client/endpoints'
import { useRouter } from 'next/router'

export const useSettings = (config?: UseQueryOptions<Settings, Error>) => {
  const { locale } = useRouter()

  const formattedOptions = {
    language: locale
  }

  const { data, isLoading, error } = useQuery<Settings, Error>(
    [API_ENDPOINTS.SETTINGS, formattedOptions],
    ({ queryKey, pageParam }) =>
      client.settings.all(Object.assign({}, queryKey[1], pageParam)),
    {
      staleTime: 1000 * 60 * 60, // 1 hour
      cacheTime: 1000 * 60 * 60,
      ...config
    }
  )

  return {
    ...config,
    settings: data?.options,
    isLoading,
    error
  }
}
