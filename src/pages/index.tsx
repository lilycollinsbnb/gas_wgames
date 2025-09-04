import type { GetStaticProps } from 'next'
import type {
  CategoryQueryOptions,
  NextPageWithLayout,
  AssetQueryOptions,
  SettingsQueryOptions
} from '@/types'
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
import SeoData from '@/components/product/seoData'
import PageDescription from '@/layouts/_page-description'

interface HomeProps {}

export const getStaticProps: GetStaticProps<HomeProps> = async ({ locale }) => {
  let cwd = process.cwd()

  const queryClient = new QueryClient()
  try {
    await Promise.all([
      queryClient.prefetchQuery(
        [API_ENDPOINTS.SETTINGS, { language: locale }],
        ({ queryKey }) =>
          client.settings.all(queryKey[1] as SettingsQueryOptions)
      ),
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
    return {
      notFound: true,
      revalidate: 15 * 60 // In seconds
    }
  }
}

function Products() {
  const { query } = useRouter()
  const { products, loadMore, hasNextPage, isLoadingMore, isLoading } =
    useProducts({
      ...(query.category && { categories: query.category }),
      ...(query.price && { price: query.price }),
      sortedBy: 'DESC'
    })
  return (
    <AssetGrid
      products={products}
      limit={30}
      onLoadMore={loadMore}
      hasNextPage={hasNextPage}
      isLoadingMore={isLoadingMore}
      isLoading={isLoading}
    />
  )
}

const Home: NextPageWithLayout<HomeProps> = ({}) => {
  return (
    <>
      {/* <SeoData jsonLdData={jsonLdData} jsonSchemaData={jsonSchemaData} /> */}
      <Seo url={''} canonical={''} />
      <div className="hide-on-mobile hidden">
        <CategoryFilter />
      </div>
      <Products />
      <PageDescription />
    </>
  )
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default Home
