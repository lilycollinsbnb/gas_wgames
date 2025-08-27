import type {
  NextPageWithLayout,
  AssetQueryOptions,
  SettingsQueryOptions,
  Shop
} from '@/types'
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType
} from 'next'
import { dehydrate, QueryClient } from 'react-query'
import { motion } from 'framer-motion'
import cn from 'classnames'
import client from '@/data/client'
import Layout from '@/layouts/_layout'
import { Tab } from '@/components/ui/tab'
import AssetGrid from '@/components/product/grid'
import { MapPinIcon } from '@/components/icons/map-pin-icon'
import { AtIcon } from '@/components/icons/at-icon'
import { getIcon } from '@/lib/get-icon'
import * as socialIcons from '@/components/icons/social'
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom'
import { useProducts } from '@/data/product'
import { useMe } from '@/data/user'
import { API_ENDPOINTS } from '@/data/client/endpoints'
import placeholder from '@/assets/images/placeholders/product.svg'
import { formatAddress } from '@/lib/format-address'
import FollowButton from '@/components/follow/follow-button'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import invariant from 'tiny-invariant'
import { useShop, useShopById } from '@/data/shop'
import dynamic from 'next/dynamic'
import Seo from '@/layouts/_seo'
import routes from '@/config/routes'
import ImageWithFallback from '@/components/ui/image-with-fallback'

import AboutShop from '@/components/shop/about-shop'

// This function gets called at build time
type ParsedQueryParams = {
  shopSlug: string
}

export const getStaticPaths: GetStaticPaths<ParsedQueryParams> = async ({
  locales
}) => {
  invariant(locales, 'locales is not defined')
  const { data } = await client.shops.all({
    limit: 100,
    is_active: true,
    include_asset_count: false,
    include_order_count: false
  })

  const paths = data?.flatMap((shop) =>
    locales?.map((locale) => ({ params: { shopSlug: shop.slug }, locale }))
  )
  return {
    paths,
    fallback: 'blocking'
  }
}

type PageProps = {
  shop: Shop
}

export const getStaticProps: GetStaticProps<
  PageProps,
  ParsedQueryParams
> = async ({ params, locale }) => {
  const queryClient = new QueryClient()
  const { shopSlug } = params!
  try {
    const shop = await client.shops.get(shopSlug)
    await Promise.all([
      queryClient.prefetchQuery(
        [API_ENDPOINTS.SETTINGS, { language: locale }],
        ({ queryKey }) =>
          client.settings.all(queryKey[1] as SettingsQueryOptions)
      ),
      queryClient.prefetchInfiniteQuery(
        [API_ENDPOINTS.PRODUCTS_PUBLIC, { shop_id: shop.id, language: locale }],
        ({ queryKey }) => client.assets.all(queryKey[1] as AssetQueryOptions)
      )
    ])
    return {
      props: {
        shop,
        ...(await serverSideTranslations(locale!, ['common'])),
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient)))
      },
      revalidate: 15 * 60
    }
  } catch (error) {
    return {
      notFound: true,
      revalidate: 15 * 60
    }
  }
}

function ShopProducts({ shopId }: { shopId: string }) {
  const { products, isLoading, loadMore, isLoadingMore, hasNextPage } =
    useProducts({
      shop_id: shopId
    })
  return (
    <AssetGrid
      products={products}
      isLoading={isLoading}
      onLoadMore={loadMore}
      isLoadingMore={isLoadingMore}
      hasNextPage={hasNextPage}
    />
  )
}

const ShopPage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ shop }) => {
  const { id, slug, name, description, logo, cover_image, owner_id } = shop
  const { me, isLoading } = useMe()
  const { t } = useTranslation('common')
  return (
    <>
      <Seo
        title={`${name} | Assets 4 Godot`}
        description={description}
        url={routes.shopUrl(slug)}
        canonical={routes.shopUrl(slug)}
      />
      <div className="shopBanner relative w-full">
        <div className="absolute left-0 top-0 h-full w-full">
          <ImageWithFallback
            alt={name}
            fill
            className="object-cover"
            src={cover_image?.original ?? placeholder}
          />
        </div>
        <div className="relative z-10 h-full w-full bg-white/[0.85] px-4 pb-16 pt-10 text-center backdrop-blur-sm dark:bg-dark/[0.85] lg:px-8 lg:pb-20 lg:pt-14">
          <div className="relative mx-auto h-[75px] w-[75px] md:h-20 md:w-20 2xl:h-[90px] 2xl:w-[90px] 3xl:h-[100px] 3xl:w-[100px]">
            <ImageWithFallback
              alt={name}
              fill
              className="object-cover"
              quality={100}
              src={logo?.original ?? placeholder}
            />
          </div>
          <h1 className="mt-3 text-sm font-medium text-dark-100 dark:text-light lg:text-15px 2xl:mt-4">
            {name}
          </h1>
          <div className="mt-3.5 flex justify-center md:mt-4 lg:mt-5">
            {me && me?.id !== owner_id && <FollowButton shop_id={id} />}
          </div>
        </div>
      </div>
      <Tab.Group>
        <Tab.List className="relative z-10 -mt-[34px] space-x-6 px-4 text-center text-13px rtl:space-x-reverse lg:space-x-8">
          <Tab
            className={({ selected }) =>
              cn(
                'relative pb-3.5 before:absolute before:bottom-0 before:left-0 before:h-0.5 before:bg-dark-400 before:transition-all before:duration-300 before:ease-in-out hover:text-dark-100 dark:before:bg-light-400 dark:hover:text-light',
                {
                  'font-semibold text-dark-100 before:w-full dark:text-light':
                    selected,
                  'text-dark-400 before:w-0 dark:text-light-800': !selected
                }
              )
            }
          >
            {t('text-products')}
          </Tab>
          <Tab
            className={({ selected }) =>
              cn(
                'relative pb-3.5 before:absolute  before:bottom-0 before:left-0 before:h-0.5 before:bg-dark-400 before:transition-all before:duration-300 before:ease-in-out hover:text-dark-100 dark:before:bg-light-400 dark:hover:text-light',
                {
                  'font-semibold text-dark-100 before:w-full dark:text-light':
                    selected,
                  'text-dark-400 before:w-0 dark:text-light-800': !selected
                }
              )
            }
          >
            {t('text-about')}
          </Tab>
        </Tab.List>
        <Tab.Panels className="h-full">
          <Tab.Panel className="flex h-full focus:outline-none lg:pt-3 xl:pt-4">
            <ShopProducts shopId={shop.id} />
          </Tab.Panel>
          <Tab.Panel className="px-4 py-6 focus:outline-none md:px-6 md:py-8 lg:px-8 lg:py-10">
            <AboutShop shop={shop} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </>
  )
}

ShopPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default ShopPage
