import Image from '@/components/ui/image'
import routes from '@/config/routes'
import { useModalState } from '@/components/modal-views/context'
import AnchorLink from '@/components/ui/links/anchor-link'
import ProductSocialShare from '@/components/product/product-social-share'
import ProductInformation from '@/components/product/product-information'
import ProductThumbnailGallery from '@/components/product/product-thumbnail-gallery'
import { useProduct } from '@/data/product'
import ProductPopupLoader from '@/components/product/product-popup-loader'
import isEmpty from 'lodash/isEmpty'
import FavoriteButton from '@/components/favorite/favorite-button'
import { useTranslation } from 'next-i18next'
import React from 'react'
import dynamic from 'next/dynamic'
import { Attachment, ItemType } from '@/types'
import MarkdownRenderer from '../ui/markdown-renderer'

const ProductShopDetails = dynamic(
  () => import('@/components/product/product-shop-details'),
  { ssr: false }
)
const AddToCart = dynamic(() => import('@/components/cart/add-to-cart'), {
  ssr: false
})

const FreeDownloadButton = dynamic(() => import('./free-download-button'), {
  ssr: false
})

// Function to get previews from the gallery
function getPreviews(gallery: Attachment[], image?: Attachment) {
  if (!isEmpty(gallery) && Array.isArray(gallery)) return gallery
  if (!isEmpty(image)) return [image]
  return [{}]
}

const ProductPopupDetails: React.FC = () => {
  const { data } = useModalState()
  const { t } = useTranslation('common')
  const { product, isLoading } = useProduct(data.slug)

  if (!product && isLoading) return <ProductPopupLoader />
  if (!product) return <div>{t('text-not-found')}</div>

  const {
    name,
    description,
    slug,
    image,
    updated_at,
    created_at,
    gallery,
    tags,
    custom_tags,
    categories,
    videos,
    godot_version,
    license,
    price,
    sale_price
  } = product

  const previews = getPreviews(gallery, image)

  return (
    <div className="flex h-screen w-full max-w-[84rem] flex-col overflow-hidden bg-light text-left dark:bg-dark-250 md:max-h-[90vh] md:max-h-[90vh] md:max-w-2xl lg:max-w-4xl xl:max-w-[70rem] 2xl:max-w-[78rem] 3xl:max-w-[85rem]">
      {/* Fixed Header */}
      <div className="-mx-2.5 flex flex-wrap items-center bg-light-300 py-3 ltr:pl-4 ltr:pr-16 rtl:pl-16 rtl:pr-4 dark:bg-dark-100 md:py-4 ltr:md:pl-6 rtl:md:pr-6 lg:-mx-4 lg:py-5 ltr:xl:pl-8 rtl:xl:pr-8">
        {/* Product Name with Favorite Button */}
        <div className="flex items-center space-x-2">
          <h2
            title={name}
            className="truncate px-2.5 py-1 text-base font-medium text-dark dark:text-light md:text-lg ltr:lg:pl-4 ltr:lg:pr-1 rtl:lg:pl-5 rtl:lg:pr-1 3xl:text-xl"
          >
            <AnchorLink
              href={routes.assetUrl(slug)}
              className="transition-colors hover:text-brand"
            >
              {name}
            </AnchorLink>
          </h2>
          <FavoriteButton
            id="fav-button"
            productId={product?.id}
            className="transition-colors hover:text-brand"
          />
        </div>

        {/* Larger space before ProductShopDetails */}
        <div className="flex items-center">
          <ProductShopDetails product={product ?? {}} />
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-col md:flex-row">
          {/* Left Column */}
          <div className="flex w-full flex-col  md:w-1/2 lg:max-w-[550px]">
            <ProductThumbnailGallery
              gallery={previews}
              videos={videos}
              className="xs:max-w-[80vw] sm:max-w-[85vw]"
            />
            <div className="mt-4">
              <ProductSocialShare productSlug={slug} />
            </div>
            <div className="mt-4">
              <ProductInformation
                tags={tags}
                customTags={custom_tags}
                categories={categories}
                created_at={created_at}
                updated_at={updated_at}
                godotVersion={godot_version}
                license={license}
                className="border-light-500 py-5 dark:border-dark-500 lg:py-6 3xl:py-10"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="mt-4 flex-shrink-0 flex-col justify-between text-13px md:mt-0 md:w-1/2 lg:w-[400px] xl:w-[520px] 3xl:w-[555px]">
            <div className="pb-7 xs:pb-8 lg:pb-10">
              <MarkdownRenderer
                content={description}
                className="max-h-[450px] px-5 pb-5 leading-[1.9em]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="flex-shrink-0 bg-light-100 px-4 py-3 dark:bg-dark-250 md:py-4 lg:py-4">
        <div className="flex flex-col lg:flex-row gap-2 sm:gap-4">
          {/* {product?.is_foss && (
            <FreeDownloadButton
              className="w-full"
              item={{ ...product, item_type: ItemType.Asset }}
            />
          )} */}
          <AddToCart
            item={{ ...product, item_type: ItemType.Asset }}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}

export default ProductPopupDetails
