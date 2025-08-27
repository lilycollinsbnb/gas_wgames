import routes from '@/config/routes'
import client from '@/data/client'
import Layout from '@/layouts/_layout'
import Seo from '@/layouts/_seo'
import {
  CategoryTree,
  GodotVersionOption,
  License,
  NextPageWithLayout,
  SortOrder
} from '@/types'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import CategoryTreeView from '@/components/category/category-tree'
import { useProducts } from '@/data/product'
import AssetGrid from '@/components/product/grid'
import { useRouter } from 'next/router'
import LicenseFilter from '@/components/license/license-filter'
import GodotVersionFilter from '@/components/product/godot-version-filter'
import Image from 'next/image'
import ImageWithFallback from '@/components/ui/image-with-fallback'

interface CategoryTreePageProps {
  categoryTree: CategoryTree
  licenses: License[]
  godotVersions: GodotVersionOption[]
}

export const getStaticProps: GetStaticProps<CategoryTreePageProps> = async ({
  locale
}) => {
  try {
    const categoryTree = await client.categories.tree()
    const licenses = await client.licenses.all({
      limit: 100,
      include_admin_created: true,
      include_content: false
    })
    const godotVersions = await client.godotVersions.all({
      limit: 100,
      sortedBy: SortOrder.Asc,
      orderBy: 'label'
    })
    return {
      props: {
        categoryTree,
        licenses: licenses.data,
        godotVersions: [
          { label: 'text-any-godot-version', value: '' },
          ...godotVersions?.data?.map((x) => {
            return { label: x.label, value: x.value }
          })
        ],
        ...(await serverSideTranslations(locale!, ['common', 'about-us']))
      },
      revalidate: 30 * 60 // Revalidate every 30 minutes
    }
  } catch (error) {
    return {
      props: {
        categoryTree: {
          roots: [],
          leaves: [],
          count: 0
        },
        licenses: [],
        godotVersions: [],
        ...(await serverSideTranslations(locale!, ['common', 'about-us']))
      },
      revalidate: 30 * 60
    }
  }
}

function Products() {
  const { query } = useRouter()
  const categoriesParam = query.categories
  const licenseParam = query.license as string | undefined
  const godotVersion = query.version as string | undefined

  let categories = [] as string[]

  if (categoriesParam) {
    // If query.categories is a string, split it by commas, or keep it as a single element array
    categories =
      typeof categoriesParam === 'string'
        ? categoriesParam.split(',')
        : (categoriesParam ?? [])
  }

  const { products, loadMore, hasNextPage, isLoadingMore, isLoading } =
    useProducts({
      ...(categoriesParam && { categories: categories }),
      license_id: licenseParam ?? '',
      godot_version: godotVersion ?? '',
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

const CategoryTreePage: NextPageWithLayout<CategoryTreePageProps> = ({
  categoryTree,
  licenses,
  godotVersions
}) => {
  const { t } = useTranslation('common')

  return (
    <div className="px-4 pt-5 md:px-6 lg:px-7 3xl:px-8">
      <Seo
        title="Games Assets Categories"
        description="Discover a wide range of Godot game asset categories, from 2D sprites and 3D models to audio files and shaders. Find the perfect assets to enhance your Godot projects and streamline your game development process with our curated selection"
        url={routes.categories}
        canonical={routes.categories}
      />
      <h1 className="mb-5 text-lg font-bold text-gray-900 dark:text-gray-100">
        {t('text-godotpedia')}
      </h1>

      {/* Flex Layout */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Section 1: Category Tree (1/3) */}
        <div className="flex-shrink-0 flex-grow-0 basis-1/4">
          <div className="mb-4 w-full">
            <ImageWithFallback
              src="/images/godot-frog.png"
              alt="Godotpedia"
              layout="responsive"
              width={1024}
              height={1024}
            />
          </div>
          <LicenseFilter licenses={licenses} />
          <GodotVersionFilter versions={godotVersions} />
          <CategoryTreeView categoryTree={categoryTree} />
        </div>

        {/* Section 2: Products (2/3) */}
        <div className="flex-grow basis-3/4">
          <Products />
        </div>
      </div>
    </div>
  )
}

CategoryTreePage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>
}

export default CategoryTreePage
