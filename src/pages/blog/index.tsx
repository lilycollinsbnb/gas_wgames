import type { NextPageWithLayout, SettingsQueryOptions } from '@/types'
import type { GetStaticProps } from 'next'
import Layout from '@/layouts/_layout'
import Seo from '@/layouts/_seo'
import routes from '@/config/routes'
import client from '@/data/client'
import { dehydrate, QueryClient } from 'react-query'
import { API_ENDPOINTS } from '@/data/client/endpoints'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useBlogPosts } from '@/data/blog-post'
import BlogGrid from '@/components/blog/grid'
import { useTranslation } from 'next-i18next'

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const queryClient = new QueryClient()
  try {
    await Promise.all([
      queryClient.prefetchQuery(
        [API_ENDPOINTS.SETTINGS, { language: locale }],
        ({ queryKey }) =>
          client.settings.all(queryKey[1] as SettingsQueryOptions)
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
    //* if we get here, the product doesn't exist or something else went wrong
    return {
      notFound: true,
      revalidate: 15 * 60 // In seconds
    }
  }
}

function BlogPosts() {
  const { blogPosts, loadMore, hasNextPage, isLoadingMore, isLoading } =
    useBlogPosts({ orderBy: 'priority_index', sortedBy: 'desc' })
  return (
    <BlogGrid
      blogPosts={blogPosts}
      limit={30}
      onLoadMore={loadMore}
      hasNextPage={hasNextPage}
      isLoadingMore={isLoadingMore}
      isLoading={isLoading}
    />
  )
}

const Home: NextPageWithLayout = () => {
  const { t } = useTranslation('common')
  return (
    <>
      <Seo
        // title="Godot Asset Store"
        // description="2D and 3D assets for your Godot projects."
        title="Blog - Godot Tutorials, Articles and Game Developement Tips"
        description="Explore our comprehensive collection of Godot articles and tutorials. Learn game development with in-depth guides, tips, and best practices for using Godot Engine. Perfect for beginners and seasoned developers alike."
        url={routes.blog}
        canonical={routes.blog}
      />
      <div className="w-full px-4 pt-5 md:px-6 md:pt-6 lg:px-7 3xl:px-8">
        <h1 className="text-lg">{t('text-blog')}</h1>
      </div>
      <BlogPosts />
    </>
  )
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default Home
