import usePrice from '@/lib/hooks/use-price'
import AnchorLink from '@/components/ui/links/anchor-link'
import routes from '@/config/routes'
import type { Item } from '@/components/cart/lib/cart.utils'
import placeholder from '@/assets/images/placeholders/product.svg'
import { useTranslation } from 'react-i18next'
import { ChangedPriceProduct, ItemType } from '@/types'
import ImageWithFallback from '../ui/image-with-fallback'

function handleItemUrl(item: Item) {
  switch (item.item_type) {
    case ItemType.Asset:
      return routes.assetUrl(item.slug)
    case ItemType.Game:
      return routes.gameUrl(item.slug)
    default:
      return routes.assetUrl(item.slug)
  }
}

export default function CartItem({
  item,
  notAvailable,
  changedPriceItem
}: {
  item: Item
  notAvailable?: boolean
  changedPriceItem?: ChangedPriceProduct
}) {
  const { name, image, slug, price, shop, quantity } = item
  const { price: itemPrice } = usePrice({
    amount: price
  })
  const { price: oldPrice } = usePrice({
    amount: changedPriceItem?.old_price ?? 0
  })
  const { price: newPrice } = usePrice({
    amount: changedPriceItem?.new_price ?? 0
  })

  const itemUrl = handleItemUrl(item)

  const { t } = useTranslation('common')
  return (
    <div className="flex w-full items-start gap-4 py-3">
      <div className="relative aspect-[4/3] w-28 flex-shrink-0 border border-light-300 bg-light-300 dark:border-0 dark:bg-dark-500 xs:w-32">
        <ImageWithFallback
          alt={name}
          fill
          objectFit="cover"
          src={image ?? placeholder}
          className="object-cover"
        />
      </div>
      <div className="w-[calc(100%-125px)] text-13px font-medium xs:w-[calc(100%-145px)] sm:w-[calc(100%-150px)]">
        {notAvailable && (
          <span className="mb-1 inline-block rounded-2xl text-xs font-semibold text-red-500">
            {t('text-not-available')}
          </span>
        )}
        <h3 className="truncate text-dark dark:text-light">
          <AnchorLink
            href={routes.assetUrl(slug)}
            className="transition-colors hover:text-brand-dark"
          >
            {name}
          </AnchorLink>
        </h3>
        <p className="mb-2.5 mt-1">
          <AnchorLink
            href={routes.shopUrl(shop.slug)}
            className="text-light-base transition-colors hover:text-brand-dark dark:text-dark-base"
          >
            {shop.name}
          </AnchorLink>
        </p>
        <p className="flex items-center gap-1">
          {changedPriceItem ? (
            <div>
              <span className="mb-1 inline-block rounded-2xl font-semibold text-red-500">
                {t('text-changed-price')}
              </span>
              <span className="ml-2 rounded-2xl bg-light-300 p-1.5 font-semibold uppercase leading-none text-brand-dark dark:bg-dark-500">
                {`${oldPrice} -> ${newPrice}`}
              </span>
            </div>
          ) : (
            <span className="rounded-2xl bg-light-300 p-1.5 font-semibold uppercase leading-none text-brand-dark dark:bg-dark-500">
              {itemPrice}
            </span>
          )}
        </p>
      </div>
    </div>
  )
}
