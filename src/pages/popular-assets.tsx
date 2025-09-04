import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetStaticProps } from 'next'
import type { NextPageWithLayout } from '@/types'
import { useState } from 'react'
import Layout from '@/layouts/_layout'
import { usePopularProducts } from '@/data/product'
import AssetGrid from '@/components/product/grid'
import Seo from '@/layouts/_seo'
import routes from '@/config/routes'
import ButtonGroup from '@/components/ui/button-group'
import { useTranslation } from 'next-i18next'
import { QueryClient } from 'react-query'
import client from '@/data/client'
import { error } from 'console'

const MAP_RANGE_FILTER = [
  {
    label: 'text-weekly',
    range: 7
  },
  {
    label: 'text-monthly',
    range: 30
  },
  {
    label: 'text-yearly',
    range: 365
  }
]

interface PopularProductsProps {
  weeklyProducts: any[]
  monthlyProducts: any[]
  yearlyProducts: any[]
}

function Products({
  weeklyProducts,
  monthlyProducts,
  yearlyProducts
}: PopularProductsProps) {
  const { t } = useTranslation('common')
  const [selected, setRange] = useState(MAP_RANGE_FILTER[2])
  const products =
    selected.range === 7
      ? weeklyProducts
      : selected.range === 30
      ? monthlyProducts
      : yearlyProducts

  return (
    <>
      <div className="flex flex-col-reverse flex-wrap items-center justify-between px-4 pb-4 pt-5 xs:flex-row xs:space-x-4 md:px-6 md:pt-6 lg:px-7 3xl:px-8">
        <div className="pt-3 xs:pt-0">
          {t('text-total')} {products.length} {t('text-product-found')}
        </div>
        <ButtonGroup
          items={MAP_RANGE_FILTER}
          selectedValue={selected}
          onChange={setRange}
        />
      </div>
      <AssetGrid
        products={products}
        hasNextPage={false}
        isLoadingMore={false}
        isLoading={false}
      />
    </>
  )
}

const PopularProductsPage: NextPageWithLayout<PopularProductsProps> = ({
  weeklyProducts,
  monthlyProducts,
  yearlyProducts
}) => {
  return (
    <>
      <Seo
        title="Popular Assets - Top-Rated Godot Game Assets"
        description="Discover the most popular assets for Godot Engine, sorted by time frames: last week, month, and year. Find the top-rated resources quickly!"
        url={routes.popularAssets}
        canonical={routes.popularAssets}
      />
      <Products
        weeklyProducts={weeklyProducts}
        monthlyProducts={monthlyProducts}
        yearlyProducts={yearlyProducts}
      />
    </>
  )
}

PopularProductsPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

const fetchPopularProducts = async (range: number) => {
  const assets = await client.assets.popular({ range: range })
  return assets
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const weeklyProducts = await fetchPopularProducts(7)
    const monthlyProducts = await fetchPopularProducts(30)
    const yearlyProducts = await fetchPopularProducts(365)

    return {
      props: {
        ...(await serverSideTranslations(locale!, ['common'])),
        weeklyProducts,
        monthlyProducts,
        yearlyProducts
      },
      revalidate: 60 * 60 // In seconds
    }
  } catch (error) {
    console.error('Error fetching popular products:', error)
    return {
      props: {
        ...(await serverSideTranslations(locale!, ['common'])),
        weeklyProducts: [],
        monthlyProducts: [],
        yearlyProducts: [],
        error: 'Failed to fetch popular products.'
      },
      revalidate: 15 * 60 // In seconds
    }
  }
}

export default PopularProductsPage
