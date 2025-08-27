import AnchorLink from '@/components/ui/links/anchor-link'
import routes from '@/config/routes'
import usePrice from '@/lib/hooks/use-price'
import { Game } from '@/types'
import placeholder from '@/assets/images/placeholders/product.svg'
import ImageWithFallback from '../ui/image-with-fallback'

export default function GameCard({ game }: { game: Game }) {
  const { name = '-', slug = '#', image, price = 0 } = game || {}

  const { price: formattedPrice } = usePrice({
    amount: price
  })

  const imageSrc = image?.original ?? placeholder

  return (
    <div className="group relative flex w-full flex-col overflow-hidden rounded-lg transition-all hover:shadow-xl">
      {/* Image Section */}
      <AnchorLink
        href={routes.gameUrl(slug)}
        className="relative aspect-[16/9] w-full"
      >
        <ImageWithFallback
          src={imageSrc}
          alt={name}
          layout="fill"
          objectFit="cover"
          className="absolute inset-0"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </AnchorLink>

      {/* Info Section */}
      <div className="flex flex-col justify-between bg-light p-4 dark:bg-dark-300">
        <h3 className="truncate text-xl font-semibold text-dark dark:text-light">
          <AnchorLink
            href={routes.gameUrl(slug)}
            className="hover:text-brand dark:hover:text-mint"
          >
            {name}
          </AnchorLink>
        </h3>
        <span className="text-lg font-medium text-dark dark:text-light">
          {formattedPrice}
        </span>
      </div>
    </div>
  )
}