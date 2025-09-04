import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import type {
  Category,
  CategoryTreeNode,
  NextPageWithLayout,
  AssetQueryOptions,
  Tag
} from '@/types'
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
import { useRouter } from 'next/router'
import Seo from '@/layouts/_seo'
import TagFilter from '@/components/product/tag-filter'
import routes from '@/config/routes'
import { useMemo } from 'react'
import { seoSettings } from '@/layouts/_default-seo'
import CategoryBreadcrumbs from '@/components/ui/links/category-breadcrumbs'
import { useCategoryTree } from '@/data/category'
import ActiveLink from '@/components/ui/links/active-link'
import MarkdownRenderer from '@/components/ui/markdown-renderer'

// This function gets called at build time
type ParsedQueryParams = {
  path: string[]
}

export const getStaticPaths: GetStaticPaths<ParsedQueryParams> = async ({
  locales
}) => {
  invariant(locales, 'locales is not defined')
  const { data } = await client.categories.all({ limit: 999 })

  const paths = data?.flatMap((category) =>
    locales?.map((locale) => ({
      params: { path: category.url.slice(1).split('/') },
      locale
    }))
  )
  return {
    paths,
    fallback: 'blocking'
  }
}

type PageProps = {
  category: Category
}
export const getStaticProps: GetStaticProps<
  PageProps,
  ParsedQueryParams
> = async ({ params, locale }) => {
  const queryClient = new QueryClient()
  const { path } = params!

  // Check if the path should skip processing, for example _next/static/
  if (
    Array.isArray(path) &&
    (path[0].startsWith('_next/') || path[0].startsWith('api/'))
  ) {
    return {
      notFound: true
    }
  }

  try {
    const categorySlug = path.at(-1)
    const [category] = await Promise.all([
      client.categories.get({ slug: categorySlug!, language: locale }),
      queryClient.prefetchInfiniteQuery(
        [
          API_ENDPOINTS.PRODUCTS_PUBLIC,
          { categories: categorySlug, language: locale }
        ],
        ({ queryKey }) => client.assets.all(queryKey[1] as AssetQueryOptions)
      )
    ])

    if (category.url !== `/${path.join('/')}`) {
      // return {
      //   redirect: {
      //     destination: category.url,
      //     permanent: false,
      //   },
      // };
      return {
        revalidate: 60 * 60, // In seconds
        notFound: true
      }
    }

    return {
      props: {
        category: category,
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
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

// Recursive function to find category node and its children
const findCategoryAndChildren = (
  nodes: CategoryTreeNode[],
  slug: string
): CategoryTreeNode | null => {
  for (const node of nodes) {
    if (node.category.slug === slug) {
      return node // Found the category
    }

    // Recursively search in children
    const found = findCategoryAndChildren(node.children, slug)
    if (found) {
      return found // Found in children
    }
  }
  return null // Not found
}

const CategoryPage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ category }) => {
  const { query } = useRouter()
  const { t } = useTranslation('common')
  const {
    products,
    paginatorInfo,
    isLoading,
    loadMore,
    hasNextPage,
    isLoadingMore
  } = useProducts(
    {
      categories: category.slug,
      ...(query.tag && { tags: query.tag })
    },
    {
      // time in milliseconds
      staleTime: 15 * 60 * 1000
    }
  )

  const { categoryTree, isLoading: isLoadingTree } = useCategoryTree()

  const currentCategoryNode = findCategoryAndChildren(
    categoryTree?.roots ?? [],
    category.slug
  )
  const childCategories = currentCategoryNode?.children || []

  const seoProps = useMemo(
    () => ({
      title: category.name,
      description: category.description,
      url: category.url
    }),
    [category]
  )

  return (
    <>
      <TagFilter basePath={category.url} />
      <div className="flex flex-col items-center justify-between gap-1.5 px-4 pt-5 xs:flex-row md:px-6 md:pt-6 lg:px-7 3xl:px-8">
        <Seo
          title={`${seoProps.title} | ${seoSettings.siteName2}`}
          description={seoProps.description}
          url={seoProps.url}
          canonical={seoProps.url}
        />
        <h1 className="text-lg font-medium capitalize text-dark-100 dark:text-light">
          {category?.name.toUpperCase()}
        </h1>
        <div>
          {t('text-total')} {paginatorInfo?.total} {t('text-product-found')}
        </div>
      </div>
      <div className="flex flex-col items-center justify-between gap-1.5 px-4 pt-5 xs:flex-row md:px-6 md:pt-6 lg:px-7 3xl:px-8">
        {categoryTree && (
          <CategoryBreadcrumbs
            categoryTree={categoryTree}
            currentCategorySlug={category.slug}
          />
        )}
      </div>
      <div className="flex flex-col items-center justify-between gap-1.5 px-4 pt-5 xs:flex-row md:px-6 md:pt-6 lg:px-7 3xl:px-8">
        {categoryTree && childCategories.length > 0 && (
          <ul>
            {childCategories.map((child) => (
              <li key={child.category.id}>
                <ActiveLink href={child.category.url} className="link-hover">
                  {child.category.name}
                </ActiveLink>
              </li>
            ))}
          </ul>
        )}
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
        content={category?.article ?? ''}
        className="mb-5 px-4"
      />
    </>
  )
}

CategoryPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
export default CategoryPage
