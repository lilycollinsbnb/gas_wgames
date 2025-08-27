import ImageWithFallback from '@/components/ui/image-with-fallback'
import AnchorLink from '@/components/ui/links/anchor-link'
import routes from '@/config/routes'
import { useTranslation } from 'next-i18next'
import AddToCart from '@/components/cart/add-to-cart'
import { ItemType, type Asset, type User } from '@/types'
import placeholder from '@/assets/images/placeholders/product.svg'
import { isFree } from '@/lib/is-free'
import usePrice from '@/lib/hooks/use-price'
import { VAT_RATE } from '@/data/static/vat-rate'

type Props = {
  product: Asset
  me: User | null | undefined
}

export default function AssetCardInfoSection({ product, me }: Props) {
  const { t } = useTranslation('common')
  const { name, slug, shop } = product ?? {}

  const { price, basePrice } = usePrice({
    amount: product.sale_price ? product.sale_price : product.price,
    baseAmount: product.price
  })

  const netAmount = product.sale_price ?? product.price
  const baseNetAmount = product.price

  const { price: netPriceFormatted, basePrice: netBasePriceFormatted } =
    usePrice({
      amount: netAmount,
      baseAmount: baseNetAmount
    })

  const { price: grossPriceFormatted } = usePrice({
    amount: netAmount * (1 + VAT_RATE)
  })

  const { price: grossBasePriceFormatted } = usePrice({
    amount: baseNetAmount * (1 + VAT_RATE)
  })
  const isFreeItem = isFree(product?.sale_price ?? product?.price)

  return (
    <div className="flex items-start justify-between pt-2">
      {/* <div className="relative flex h-8 w-8 flex-shrink-0 overflow-hidden 4xl:h-9 4xl:w-9">
        {shop && (
          <ImageWithFallback
            alt={shop?.name}
            quality={100}
            fill
            src={shop?.logo?.thumbnail ?? placeholder}
            className="rounded-full bg-light-500 object-cover dark:bg-dark-400"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
      </div> */}
      <div className="-mt-[1px] flex flex-col truncate rtl:text-right">
        <h3
          title={name}
          className="mb-0.5 h-6 truncate text-15px font-medium text-dark-100 dark:text-light"
        >
          <AnchorLink
            className="hover:text-brand hover:dark:text-mint"
            href={routes.assetUrl(slug)}
          >
            {name}
          </AnchorLink>
        </h3>
        {shop && (
          <AnchorLink
            aria-label={t('Name of the seller')}
            href={routes.shopUrl(shop?.slug)}
            id={'seller-name-' + shop?.slug}
            className="h-6 font-medium text-light-base hover:text-brand dark:text-light-600 dark:hover:text-mint"
          >
            {shop?.name}
          </AnchorLink>
        )}
      </div>
      <section
        aria-label={t('Price details for the product')}
        className="flex flex-col items-end pl-2.5"
      >
        {!me?.bought_assets?.includes(product.id) ? (
          <>
            <span
              aria-label={t('Current price after all your discounts')}
              className="light:bg-light-500 whitespace-nowrap px-1.5 py-0.5 text-13px font-semibold uppercase text-brand dark:rounded-2xl dark:bg-dark-300 dark:text-brand-dark"
            >
              <AddToCart
                item={{ ...product, item_type: ItemType.Asset }}
                emoji
                nobutton
              />
              {isFreeItem
                ? t('text-free')
                : `${netPriceFormatted}+VAT / ${grossPriceFormatted}`}
            </span>
            {!isFreeItem && basePrice && (
              <del
                aria-label={t('Original price before discount')}
                className="mt-1 whitespace-nowrap px-1 text-13px font-medium text-red dark:text-mustard"
              >
                {`${grossBasePriceFormatted}`}
              </del>
            )}
          </>
        ) : (
          <span className="px-1 text-13px font-medium text-light-780 dark:text-dark-780">
            🤩{t('text-already-purchased')}
          </span>
        )}
      </section>
    </div>
  )
}
