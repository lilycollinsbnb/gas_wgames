import { GameGetOptions, GamePaginator, QueryOptions } from '@/types'
import { useRouter } from 'next/router'
import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useMutation
} from 'react-query'
import { API_ENDPOINTS } from './client/endpoints'
import client from './client'
import toast from 'react-hot-toast'
import { useModalAction } from '@/components/modal-views/context'
import { useTranslation } from 'react-i18next'
import { download } from '@/lib/download-asset'

export function useGames(
  queryOptions?: Partial<QueryOptions>,
  getOptions?: Partial<GameGetOptions>,
  config?: UseInfiniteQueryOptions<GamePaginator, Error>
) {
  const { locale } = useRouter()

  const formattedOptions = {
    ...queryOptions,
    ...getOptions,
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
  } = useInfiniteQuery<GamePaginator, Error>(
    [API_ENDPOINTS.GAMES_PUBLIC, formattedOptions],
    ({ queryKey, pageParam }) => {
      return client.games.all(Object.assign({}, queryKey[1], pageParam))
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
    games: data?.pages.flatMap((page) => page.data) ?? [],
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

export function useMyGames(
  queryOptions?: Partial<QueryOptions>,
  getOptions?: Partial<GameGetOptions>,
  config?: UseInfiniteQueryOptions<GamePaginator, Error>
) {
  const { locale } = useRouter()

  const formattedOptions = {
    ...queryOptions,
    ...getOptions,
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
  } = useInfiniteQuery<GamePaginator, Error>(
    [`${API_ENDPOINTS.GAMES}/my-games`, formattedOptions],
    ({ queryKey, pageParam }) => {
      return client.games.myGames(Object.assign({}, queryKey[1], pageParam))
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
    games: data?.pages.flatMap((page) => page.data) ?? [],
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

export const useReedeemBetaAccessMutation = () => {
  const { t } = useTranslation()
  const { closeModal } = useModalAction()
  const { mutate, isLoading, error } = useMutation(
    client.games.reedemBetaAccess,
    {
      onSuccess: (data) => {
        closeModal()
        toast.success(t('text-redeem-beta-access-success'), {
          duration: 7000 // 7 seconds in milliseconds
        })
        download(data)
      },
      onError: () => {
        toast.error(t('text-redeem-beta-access-error'), {
          duration: 7000 // 7 seconds in milliseconds
        })
      }
    }
  )

  return {
    redeemBetaAccess: mutate,
    isLoading,
    error
  }
}

export function useBetaAccessFlow() {
  const { openModal } = useModalAction()
  const { t } = useTranslation('common')

  const fetchAndOpen = async (code: string) => {
    let betaAccess
    try {
      betaAccess = await client.betaAccess.get({ code })
    } catch (err: any) {
      // Map backend 404 or "not found" to a friendly message
      if (err?.response?.status === 404) {
        throw new Error(t('text-beta-access-not-found'))
      }
      throw new Error(t('text-something-went-wrong'))
    }

    if (!betaAccess || !betaAccess.id) {
      throw new Error(t('text-beta-access-not-found'))
    }

    if (betaAccess.is_single_use && betaAccess.was_used) {
      throw new Error(t('text-beta-access-already-used'))
    }

    // Check expiration
    if (
      betaAccess.expirable &&
      betaAccess.expires_at &&
      new Date(betaAccess.expires_at).getTime() < Date.now()
    ) {
      throw new Error(t('text-beta-access-expired'))
    }

    // Fetch game details
    const game = await client.games.getById({
      id: betaAccess.game_id,
      options: {
        include_genres: false,
        include_license: false,
        include_shop: false
      }
    })

    // Open modal
    openModal('BETA_ACCESS_SELECT_PLATFORM_MODAL', {
      game_id: game.id,
      builds: game.builds,
      code,
      is_single_use: betaAccess.is_single_use,
      game
    })
  }

  return { fetchAndOpen }
}
