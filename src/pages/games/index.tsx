import type { GetStaticProps } from 'next'
import type {
  NextPageWithLayout,
  QueryOptions,
  SettingsQueryOptions
} from '@/types'
import Layout from '@/layouts/_layout'
import Seo from '@/layouts/_seo'
import routes from '@/config/routes'
import client from '@/data/client'
import { dehydrate, QueryClient } from 'react-query'
import { API_ENDPOINTS } from '@/data/client/endpoints'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import GameGrid from '@/components/games/game-grid'
import { useGames } from '@/data/games'

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const queryClient = new QueryClient()
  try {
    await Promise.all([
      queryClient.prefetchQuery(
        [API_ENDPOINTS.SETTINGS, { language: locale }],
        ({ queryKey }) =>
          client.settings.all(queryKey[1] as SettingsQueryOptions)
      ),
      queryClient.prefetchInfiniteQuery(
        [API_ENDPOINTS.GAMES, { language: locale }],
        () =>
          client.games.all({
            language: locale,
            include_license: false,
            include_genres: false,
            include_shop: true
          })
      )
    ])

    return {
      props: {
        ...(await serverSideTranslations(locale!, ['common'])),
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient)))
      },
      revalidate: 15 * 60 // In seconds
    }
  } catch (error) {
    return {
      notFound: true,
      revalidate: 15 * 60 // In seconds
    }
  }
}

function Games() {
  const { games, loadMore, hasNextPage, isLoadingMore, isLoading } = useGames(
    {},
    { include_genres: false, include_license: false, include_shop: true }
  )
  return (
    <GameGrid
      games={games}
      limit={30}
      onLoadMore={loadMore}
      hasNextPage={hasNextPage}
      isLoadingMore={isLoadingMore}
      isLoading={isLoading}
    />
  )
}

const GamesPage: NextPageWithLayout = ({}) => {
  return (
    <>
      <Seo
        title="Games made in Godot"
        url={routes.games}
        canonical={routes.games}
      />
      <Games />
    </>
  )
}

GamesPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default GamesPage
