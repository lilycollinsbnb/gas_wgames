import {
  AddToCartItem,
  PublishStatus,
  ItemType,
  type Asset,
  GameDevelopmentStage
} from '@/types'
import cn from 'classnames'
import routes from '@/config/routes'
import AnchorLink from '@/components/ui/links/anchor-link'
import placeholder from '@/assets/images/placeholders/product.svg'
import { isFree } from '@/lib/is-free'
import FavoriteButton from '@/components/favorite/favorite-button'
import { useTranslation } from 'next-i18next'

import React from 'react'
import dynamic from 'next/dynamic'
import { useShopById } from '@/data/shop'
import ImageWithFallback from '../ui/image-with-fallback'
import RedeemBetaAccessButton from '../games/game-redeem-beta-access-button'

const AddToCart = dynamic(() => import('@/components/cart/add-to-cart'), {
  ssr: false
})

const FreeDownloadButton = dynamic(() => import('./free-download-button'), {
  ssr: false
})

interface Props {
  product: AddToCartItem
  className?: string
  favButtonId: string
}

export default function ProductDetailsPaper({
  product,
  className,
  favButtonId
}: Props) {
  const { id, name, slug, price, sale_price, shop_id } = product
  const isFreeItem = isFree(sale_price ?? price)
  const { t } = useTranslation('common')
  const { shop } = useShopById(shop_id)

  return (
    <div
      className={cn(
        'items-center justify-between lg:flex lg:w-full',
        className
      )}
    >
      <div className="lg:block ltr:lg:pr-5 rtl:lg:pl-5">
        <div className="flex items-center justify-center ">
          <h1 className="text-base font-medium text-dark dark:text-light 3xl:text-lg">
            {name}
          </h1>

          {!(product.item_type === ItemType.Game) && (
            <FavoriteButton productId={product?.id} id={favButtonId} />
          )}
        </div>

        <div className="items-center pt-1.5 rtl:space-x-reverse lg:flex lg:space-x-6 lg:pt-2.5">
          <div className="flex items-center pb-4 lg:pb-0">
            <div className="relative flex h-7 w-7 flex-shrink-0">
              {shop && shop?.name && (
                <ImageWithFallback
                  alt={shop?.name}
                  fill
                  quality={100}
                  src={shop?.logo?.thumbnail ?? placeholder}
                  className="rounded-full object-cover"
                />
              )}
            </div>
            <h2 className="font-medium ltr:pl-2.5 rtl:pr-2.5 dark:text-dark-base lg:text-dark lg:dark:text-light-400">
              {shop && shop?.slug && (
                <AnchorLink
                  id={'to-shop'}
                  href={routes.shopUrl(shop?.slug)}
                  className="hover:text-brand"
                >
                  {shop?.name}
                </AnchorLink>
              )}
            </h2>
          </div>
        </div>
      </div>
      <div className="flex flex-col-reverse items-center py-3.5 sm:flex-row xs:gap-2.5 sm:py-4 md:gap-3.5 lg:w-[600px] lg:gap-4 lg:py-2 2xl:w-2/5 3xl:w-[600px]">
        {/* {product && product.is_foss && (
          <FreeDownloadButton
            className="mt-2.5 w-full flex-1 xs:mt-0"
            item={product}
          />
        )} */}
        {product && product.status === PublishStatus.Publish ? (
          product.item_type === ItemType.Game ? (
            (() => {
              switch (product.development_stage) {
                case GameDevelopmentStage.Prototype:
                  return null
                case GameDevelopmentStage.Beta:
                  return (
                    <RedeemBetaAccessButton
                      gameId={product.id}
                      builds={product.builds}
                      className="mt-2.5 w-full flex-1 xs:mt-0"
                    />
                  )
                case GameDevelopmentStage.EarlyAccess:
                case GameDevelopmentStage.Released:
                  return (
                    <AddToCart
                      item={product}
                      toastClassName="-mt-10 xs:mt-0"
                      className="mt-2.5 w-full flex-1 xs:mt-0"
                    />
                  )
                default:
                  return null
              }
            })()
          ) : (
            // For assets (or any other types in future)
            <AddToCart
              item={product}
              toastClassName="-mt-10 xs:mt-0"
              className="mt-2.5 w-full flex-1 xs:mt-0"
            />
          )
        ) : null}
      </div>
    </div>
  )
}
