import { Game, GameGetOptions, GamePaginator, QueryOptions } from '@/types'
import { useRouter } from 'next/router'
import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useMutation,
  useQuery,
  UseQueryOptions
} from 'react-query'
import { API_ENDPOINTS } from './client/endpoints'
import client from './client'
import toast from 'react-hot-toast'
import { useModalAction } from '@/components/modal-views/context'
import { useTranslation } from 'react-i18next'
import { download } from '@/lib/download-asset'
import routes from '@/config/routes'

export function useGame(id: string, options?: UseQueryOptions<Game, Error>) {
  const { locale: language } = useRouter()

  const query = useQuery<Game, Error>(
    [`${API_ENDPOINTS.GAMES}/id`, { id, language }],
    () => client.games.getById({ id, options: {} }),
    options
  )

  return {
    game: query.data,
    isLoading: query.isLoading,
    error: query.error
  }
}

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

export function useRedeemBetaAccess() {
  const { t } = useTranslation('common')
  const { openModal } = useModalAction()

  const redeem = async (code: string) => {
    let betaAccess
    try {
      betaAccess = await client.betaAccess.get({ code })
    } catch (err: any) {
      if (err?.response?.status === 404) {
        throw new Error(t('text-beta-access-not-found'))
      }
      throw new Error(t('text-something-went-wrong'))
    }

    if (!betaAccess?.id) throw new Error(t('text-beta-access-not-found'))

    if (betaAccess.is_single_use && betaAccess.was_used) {
      throw new Error(t('text-beta-access-already-used'))
    }

    if (betaAccess.expirable && betaAccess.expires_at) {
      const expired = new Date(betaAccess.expires_at).getTime() < Date.now()
      if (expired) throw new Error(t('text-beta-access-expired'))
    }

    await client.betaAccess.reedemBetaAccess({ code })

    openModal('REDEEM_BETA_ACCESS_SUCCESS_VIEW', { gameId: betaAccess.game_id })
  }

  return { redeem }
}
