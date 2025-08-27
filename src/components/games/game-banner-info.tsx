import { Game } from '@/types'
import { useTranslation } from 'next-i18next'
import dayjs from 'dayjs'
import getPlatformLabel from '@/lib/get-target-platform-label'
import usePrice from '@/lib/hooks/use-price'
import { VAT_RATE } from '@/data/static/vat-rate'

type Props = {
  game: Game
}

const GameBannerInfo: React.FC<Props> = ({ game }) => {
  const { t } = useTranslation('common')

  const priceValue = game.sale_price ?? game.price ?? 0
  const { price: basePrice } = usePrice({
    amount: priceValue,
    baseAmount: game.price ?? 0
  })

  const isFree = priceValue === 0
  const priceWithVat = priceValue * (1 + VAT_RATE)

  const { price: priceInclVat } = usePrice({
    amount: priceWithVat,
    baseAmount: game.price ?? 0
  })

  function getPriceText() {
    return isFree
      ? `( ${t('text-free')} )`
      : `${basePrice} + VAT / ${priceInclVat}`
  }

  const rows = [
    { label: t('text-publisher'), value: game.shop?.name ?? '-' },
    {
      label: t('text-release-date'),
      value: game.release_date
        ? dayjs(game.release_date).format('DD.MM.YYYY')
        : '-'
    },
    {
      label: t('text-genres'),
      value: game.genres?.map((g) => g.name).join(', ') || '-'
    },
    {
      label: t('text-platforms'),
      value:
        game.builds?.map((b) => getPlatformLabel(b.platform)).join(', ') || '-'
    },
    {
      label: t('text-quality'),
      value: game.quality ? t(`text-quality-${game.quality}`) : '-'
    },
    {
      label: t('text-price'),
      value: getPriceText()
    },
    {
      label: t('text-development-stage'),
      value: game.development_stage
        ? t(`text-development-stage-${game.development_stage}`)
        : '-'
    }
  ]

  return (
    <div>
      <h1 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl md:text-2xl lg:text-3xl 3xl:text-4xl">
        {game.name}
      </h1>

      <div className="mt-2 grid grid-cols-[max-content,1fr] gap-x-3 text-md text-gray-900 dark:text-white md:text-lg lg:text-xl 3xl:text-2xl">
        {rows.map((row) => (
          <div key={row.label} className="contents">
            <span className="font-semibold">{row.label}:</span>
            <span>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GameBannerInfo
