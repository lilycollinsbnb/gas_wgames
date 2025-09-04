import type {
  Order,
  OrderedFilePaginator,
  OrderPaginator,
  OrderQueryOptions,
  CreateOrderPaymentInput
} from '@/types'
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
  useMutation
} from 'react-query'
import { API_ENDPOINTS } from '@/data/client/endpoints'
import client from '@/data/client'
import { useModalAction } from '@/components/modal-views/context'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

export function useOrders(options?: OrderQueryOptions) {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage
  } = useInfiniteQuery<OrderPaginator, Error>(
    [API_ENDPOINTS.ORDERS, options],
    ({ queryKey, pageParam }) =>
      client.orders.all(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 }
    }
  )
  function handleLoadMore() {
    fetchNextPage()
  }
  return {
    orders: data?.pages.flatMap((page) => page.data) ?? [],
    isLoading,
    error,
    hasNextPage,
    isFetching,
    isLoadingMore: isFetchingNextPage,
    loadMore: handleLoadMore
  }
}
export function useDownloadableProductOrders(options?: OrderQueryOptions) {
  const formattedOptions = {
    ...options
    // language: locale
  }

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage
  } = useInfiniteQuery<OrderedFilePaginator, Error>(
    [API_ENDPOINTS.ORDERS_DOWNLOADS, formattedOptions],
    ({ queryKey, pageParam }) =>
      client.orders.downloadable(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 }
    }
  )
  function handleLoadMore() {
    fetchNextPage()
  }
  return {
    downloadableFiles: data?.pages.flatMap((page) => page.data) ?? [],
    isLoading,
    error,
    hasNextPage,
    isFetching,
    isLoadingMore: isFetchingNextPage,
    loadMore: handleLoadMore
  }
}

export function useOrder({ id }: { id: string }) {
  const { data, isLoading, error, isFetching, refetch } = useQuery<
    Order,
    Error
  >([API_ENDPOINTS.ORDERS, id], () => client.orders.get(id), {
    refetchOnWindowFocus: false
  })
  return {
    order: data,
    isFetching,
    isLoading,
    refetch,
    error
  }
}

export function useGetPaymentIntent(
  { order_id }: { order_id: string },
  options?: any
) {
  const { data, isLoading, error, refetch, isFetching } = useQuery(
    [API_ENDPOINTS.PAYMENT_INTENT, order_id],
    () => client.orders.getPaymentIntent(order_id),
    {
      ...options
    }
  )

  return {
    paymentIntent: data,
    getPaymentIntentQuery: refetch,
    isLoading,
    error
  }
}

export function useOrderPayment() {
  const queryClient = useQueryClient()

  const { mutate: createOrderPayment, isLoading } = useMutation(
    client.orders.payment,
    {
      onSettled: (data) => {
        queryClient.refetchQueries(API_ENDPOINTS.ORDERS)
        queryClient.refetchQueries(API_ENDPOINTS.ORDERS_DOWNLOADS)
      },
      onError: (error) => {
        const {
          response: { data }
        }: any = error ?? {}
        toast.error(data?.message)
      }
    }
  )

  function formatOrderInput(input: CreateOrderPaymentInput) {
    const formattedInputs = {
      ...input
    }
    createOrderPayment(formattedInputs)
  }

  return {
    createOrderPayment: formatOrderInput,
    isLoading
  }
}

export function useSavePaymentMethod() {
  const {
    mutate: savePaymentMethod,
    isLoading,
    error,
    data
  } = useMutation(client.orders.savePaymentMethod)

  return {
    savePaymentMethod,
    data,
    isLoading,
    error
  }
}

export const useDeleteOrder = () => {
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { closeModal } = useModalAction()

  const { mutate, isLoading, error } = useMutation(client.orders.delete, {
    onSuccess: () => {
      closeModal()
      toast.success(t('Order successfully deleted.'))
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ORDERS_DOWNLOADS)
      queryClient.invalidateQueries(API_ENDPOINTS.ORDERS)
    }
  })

  return {
    deleteOrder: mutate,
    isLoading,
    error
  }
}
