import { Game, ItemType } from '@/types'
import MarkdownRenderer from '../ui/markdown-renderer'
import ProductThumbnailGallery from '../product/product-thumbnail-gallery'
import ProductDetailsPaper from '../product/product-details-paper'
import { useTranslation } from 'next-i18next'
import usePrice from '@/lib/hooks/use-price'
import GameSystemRequirements from './game-system-requirements'
import GameDetailsView from './game-details-view'
import GameBannerInfo from './game-banner-info'

const GameView: React.FC<{ game: Game }> = ({ game }) => {
  const { t } = useTranslation('common')

  const priceValue = game.sale_price ?? game.price ?? 0
  const { price } = usePrice({
    amount: priceValue,
    baseAmount: game.price ?? 0
  })
  const isFree = priceValue === 0

  function getPriceText() {
    return isFree ? `( ${t('text-free')} )` : `${price} ( + VAT )`
  }

  return (
    <div className="relative dark:bg-dark-100">
      <GameBanner game={game} />

      {/* Gallery Section */}
      <div className="relative z-10 mx-auto mt-6 max-w-6xl">
        <ProductThumbnailGallery
          gallery={game.gallery ?? []}
          videos={game.videos ?? []}
        />
      </div>

      {/* Mobile / small screens */}
      <div className="lg:hidden relative z-10 mt-6 mx-3">
        <ProductDetailsPaper
          product={{ ...game, item_type: ItemType.Game }}
          favButtonId="fav-button-m"
        />
      </div>

      {/* Description Section */}
      <div className="relative z-10 mt-6 rounded-2xl p-6 text-gray-900 dark:text-white">
        {game.full_description && (
          <MarkdownRenderer content={game.full_description} />
        )}
      </div>

      {/* Details Section */}
      <div className="relative z-10 mt-6 p-6 dark:text-gray-100">
        <GameDetailsView game={game} />
        <GameSystemRequirements requirements={game.system_requirements} />
      </div>

      {/* Desktop sticky panel */}
      <div className="sticky bottom-0 right-0 z-10 hidden h-[100px] w-full border-t border-light-500 bg-light-100 px-8 py-5 dark:border-dark-400 dark:bg-dark-200 lg:flex 3xl:h-[120px]">
        <ProductDetailsPaper
          product={{ ...game, item_type: ItemType.Game }}
          favButtonId="fav-button"
        />
      </div>
    </div>
  )
}

type GameBannerProps = {
  game: Game
}

const GameBanner: React.FC<GameBannerProps> = ({ game }) => {
  if (!game.image?.original)
    return <div className="h-48 w-full bg-gray-200 dark:bg-dark-300" />

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: '16/9', minHeight: '240px' }}
    >
      <img
        src={game.image.original}
        alt={game.name}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-light-300 dark:from-transparent dark:to-dark-300/70"></div>

      {/* Info anchored to bottom */}
      <div className="absolute bottom-0 w-full px-4 pb-4 md:px-8">
        <GameBannerInfo game={game} />
      </div>
    </div>
  )
}

export default GameView
