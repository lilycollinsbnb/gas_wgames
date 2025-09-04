import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import type { NextPageWithLayout, AssetQueryOptions, Tag } from '@/types'
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType
} from 'next'
import AssetGrid from '@/components/product/grid'
import client from '@/data/client'
import { API_ENDPOINTS } from '@/data/client/endpoints'
import { useProducts } from '@/data/product'
import Layout from '@/layouts/_layout'
import { dehydrate, QueryClient } from 'react-query'
import invariant from 'tiny-invariant'
import Seo from '@/layouts/_seo'
import routes from '@/config/routes'
import { seoSettings } from '@/layouts/_default-seo'
import MarkdownRenderer from '@/components/ui/markdown-renderer'

// This function gets called at build time
type ParsedQueryParams = {
  tagSlug: string
}

export const getStaticPaths: GetStaticPaths<ParsedQueryParams> = async ({
  locales
}) => {
  invariant(locales, 'locales is not defined')
  const { data } = await client.tags.all({ limit: 100 })

  const paths = data?.flatMap((tag) =>
    locales?.map((locale) => ({ params: { tagSlug: tag.slug }, locale }))
  )
  return {
    paths,
    fallback: 'blocking'
  }
}

type PageProps = {
  tag: Tag
}
export const getStaticProps: GetStaticProps<
  PageProps,
  ParsedQueryParams
> = async ({ params, locale }) => {
  const queryClient = new QueryClient()
  const { tagSlug } = params! //* we know it's required because of getStaticPaths
  try {
    const [tag] = await Promise.all([
      client.tags.get({ slug: tagSlug, language: locale }),
      queryClient.prefetchInfiniteQuery(
        [API_ENDPOINTS.PRODUCTS_PUBLIC, { tags: tagSlug, language: locale }],
        ({ queryKey }) => client.assets.all(queryKey[1] as AssetQueryOptions)
      )
    ])
    return {
      props: {
        tag,
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
        ...(await serverSideTranslations(locale!, ['common']))
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
const TagPage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ tag }) => {
  const { t } = useTranslation('common')
  const {
    products,
    paginatorInfo,
    isLoading,
    loadMore,
    hasNextPage,
    isLoadingMore
  } = useProducts(
    { tags: tag.slug },
    {
      // time in milliseconds
      staleTime: 15 * 60 * 1000
    }
  )
  return (
    <>
      <Seo
        title={`${tag.name} | ${seoSettings.siteName2}`}
        url={routes.tagUrl(tag.slug)}
        description={
          tag.details ? tag.details : t('default-tag-description') + tag.name
        }
        canonical={`${routes.tagUrl(tag.slug)}`}
      />
      <div className="flex flex-col items-center justify-between gap-1.5 px-4 pt-5 xs:flex-row md:px-6 md:pt-6 lg:px-7 3xl:px-8">
        <h1 className="font-medium capitalize text-dark-100 dark:text-light">
          {tag.name}
        </h1>
        <div>
          {t('text-total')} {paginatorInfo?.total} {t('text-product-found')}
        </div>
      </div>
      <AssetGrid
        products={products}
        onLoadMore={loadMore}
        hasNextPage={hasNextPage}
        isLoadingMore={isLoadingMore}
        isLoading={isLoading}
      />
      <MarkdownRenderer
        allowHtml={true}
        sanitizeHtml={true}
        enableMarkdownPreprocessing={true}
        content={tag?.article ?? ''}
        className="mb-5 px-4"
      />
    </>
  )
}

TagPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
export default TagPage
