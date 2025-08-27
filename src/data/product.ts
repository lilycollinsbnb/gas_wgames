import type {
  FollowShopPopularProductsQueryOption,
  PopularProductsQueryOptions,
  Asset,
  AssetPaginator,
  AssetQueryOptions
} from '@/types'
import type { UseInfiniteQueryOptions } from 'react-query'
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient
} from 'react-query'
import { API_ENDPOINTS } from '@/data/client/endpoints'
import client from '@/data/client'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

export function useProducts(
  options?: Partial<AssetQueryOptions>,
  config?: UseInfiniteQueryOptions<AssetPaginator, Error>
) {
  const { locale } = useRouter()

  const formattedOptions = {
    ...options,
    language: locale
  }

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage
  } = useInfiniteQuery<AssetPaginator, Error>(
    [API_ENDPOINTS.PRODUCTS_PUBLIC, formattedOptions],
    ({ queryKey, pageParam }) => {
      return client.assets.all(Object.assign({}, queryKey[1], pageParam))
    },
    {
      ...config,
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 }
    }
  )

  function handleLoadMore() {
    fetchNextPage()
  }

  return {
    products: data?.pages.flatMap((page) => page.data) ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? data?.pages[data.pages.length - 1]
      : null,
    isLoading,
    error,
    hasNextPage,
    isFetching,
    isLoadingMore: isFetchingNextPage,
    loadMore: handleLoadMore
  }
}

export function useProduct(slug: string) {
  const { locale: language } = useRouter()

  const { data, isLoading, error } = useQuery<Asset, Error>(
    [API_ENDPOINTS.PRODUCTS, { slug, language }],
    () => client.assets.get({ slug, language })
  )
  return {
    product: data,
    isLoading,
    error
  }
}

export function usePopularProducts(
  options?: Partial<PopularProductsQueryOptions>
) {
  const { locale } = useRouter()

  const formattedOptions = {
    ...options,
    language: locale
  }

  const { data, isLoading, error } = useQuery<Asset[], Error>(
    [API_ENDPOINTS.PRODUCTS_POPULAR, formattedOptions],
    ({ queryKey }) => client.assets.popular(Object.assign({}, queryKey[1]))
  )
  return {
    popularProducts: data ?? [],
    isLoading,
    error
  }
}

export function useCreateFeedback() {
  const queryClient = useQueryClient()

  const { mutate, isLoading, error } = useMutation(client.feedback.create, {
    onSuccess: () => {
      toast.success('Feedback Submitted')
      queryClient.refetchQueries(API_ENDPOINTS.PRODUCTS_QUESTIONS)
      queryClient.refetchQueries(API_ENDPOINTS.PRODUCTS_REVIEWS)
    }
  })

  return {
    createFeedback: mutate,
    isLoading,
    error
  }
}
