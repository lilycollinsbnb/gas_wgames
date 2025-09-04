import type {
  CategoryQueryOptions,
  NextPageWithLayout,
  AssetQueryOptions
} from '@/types'
import type { GetStaticProps } from 'next'
import Layout from '@/layouts/_layout'
import { useProducts } from '@/data/product'
import AssetGrid from '@/components/product/grid'
import { useRouter } from 'next/router'
import Seo from '@/layouts/_seo'
import routes from '@/config/routes'
import client from '@/data/client'
import { dehydrate, QueryClient } from 'react-query'
import { API_ENDPOINTS } from '@/data/client/endpoints'
import CategoryFilter from '@/components/product/category-filter'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const queryClient = new QueryClient()
  try {
    await Promise.all([
      queryClient.prefetchInfiniteQuery(
        [API_ENDPOINTS.PRODUCTS_PUBLIC, { language: locale }],
        ({ queryKey }) => client.assets.all(queryKey[1] as AssetQueryOptions)
      ),
      queryClient.prefetchInfiniteQuery(
        [API_ENDPOINTS.CATEGORIES, { limit: 100, language: locale }],
        ({ queryKey }) =>
          client.categories.all(queryKey[1] as CategoryQueryOptions)
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
      revalidate: 15 * 60
    }
  }
}

function Products() {
  const { query } = useRouter()
  const { products, loadMore, hasNextPage, isLoadingMore, isLoading } =
    useProducts({
      ...(query.category && { categories: query.category }),
      ...(query.price && { price: query.price })
    })
  return (
    <AssetGrid
      products={products}
      onLoadMore={loadMore}
      hasNextPage={hasNextPage}
      isLoadingMore={isLoadingMore}
      isLoading={isLoading}
      isInfiniteScroll={true}
    />
  )
}

const Explore: NextPageWithLayout = () => {
  return (
    <>
      <Seo
        title="Featured Assets"
        description="We promote new Godot assets first to ensure every creator gets noticed - however, we now prioritize assets with videos in their descriptions even more highly, because we care about good presentation of the asset to buyers."
        url={routes.explore}
        canonical={routes.explore}
      />
      <CategoryFilter defaultActivePath={routes.explore} />
      <Products />
    </>
  )
}

Explore.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default Explore
