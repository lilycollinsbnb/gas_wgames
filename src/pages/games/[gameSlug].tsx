import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType
} from 'next'
import type { NextPageWithLayout, Game } from '@/types'
import Layout from '@/layouts/_layout'
import client from '@/data/client'
import invariant from 'tiny-invariant'
import Seo from '@/layouts/_seo'
import routes from '@/config/routes'
import { truncateDescription } from '@/lib/truncate-description'
import GameView from '@/components/games/game-view'

type ParsedQueryParams = {
  gameSlug: string
}

export const getStaticPaths: GetStaticPaths<ParsedQueryParams> = async ({
  locales
}) => {
  invariant(locales, 'locales is not defined')
  const { data } = await client.games.all({ limit: 100 })
  const paths = data?.flatMap((game) =>
    locales?.map((locale) => ({
      params: { gameSlug: game.slug },
      locale
    }))
  )
  return {
    paths,
    fallback: 'blocking'
  }
}

type PageProps = {
  game: Game
}

export const getStaticProps: GetStaticProps<
  PageProps,
  ParsedQueryParams
> = async ({ params, locale }) => {
  const { gameSlug } = params!

  try {
    const game = await client.games.get({
      slug: gameSlug,
      options: {
        language: locale,
        include_genres: true,
        include_shop: true,
        include_license: false
      }
    })
    return {
      props: {
        game,
        ...(await serverSideTranslations(locale!, ['common']))
      },
      revalidate: 15 * 60 // In seconds
    }
  } catch (error) {
    return {
      notFound: true,
      revalidate: 15 * 60
    }
  }
}

const GamesPage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ game }) => {
  return (
    <div>
      <Seo
        title={`${game.name}`}
        description={`${truncateDescription(game.meta_description, 160)}`}
        url={routes.gameUrl(game.slug)}
        canonical={routes.gameUrl(game.slug)}
        images={
          game.image && game.image.original
            ? [
                {
                  url: game.image.original,
                  width: 800,
                  height: 600,
                  alt: `${game} - cover`
                }
              ]
            : []
        }
      />
      <GameView game={game} />
    </div>
  )
}

GamesPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default GamesPage
