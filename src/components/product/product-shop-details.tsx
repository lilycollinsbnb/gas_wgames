import { useShopById } from '@/data/shop'
import AnchorLink from '../ui/links/anchor-link'
import routes from '@/config/routes'
import placeholder from '@/assets/images/placeholders/product.svg'
import { Asset } from '@/types'
import ImageWithFallback from '../ui/image-with-fallback'

interface Props {
  product: Asset
}
export default function ProductShopDetails({ product }: Props) {
  const { shop } = useShopById(product.shop_id)

  return (
    <>
      <div className="relative ml-2 flex h-5 w-5 flex-shrink-0 md:h-6 md:w-6">
        {shop && (
          <ImageWithFallback
            alt={shop?.name}
            fill
            quality={100}
            src={shop?.logo?.thumbnail ?? placeholder}
            className="rounded-full object-cover"
          />
        )}
      </div>
      <h3
        title={product.name}
        className="text-13px font-medium text-dark-600 ltr:pl-2 rtl:pr-2 dark:text-light-800 ltr:md:pl-2.5 rtl:md:pr-2.5"
      >
        {shop && (
          <AnchorLink
            href={routes.shopUrl(shop?.slug)}
            className="hover:text-accent transition-colors hover:text-brand"
          >
            {shop?.name}
          </AnchorLink>
        )}
      </h3>
    </>
  )
}
