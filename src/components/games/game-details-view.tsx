import { Game } from '@/types'
import { useTranslation } from 'next-i18next'
import dayjs from 'dayjs'
import getPlatformLabel from '@/lib/get-target-platform-label'

type Props = {
  game: Game
}

const GameDetailsView: React.FC<Props> = ({ game }) => {
  const { t } = useTranslation('common')

  const rows = [
    { label: t('text-publisher'), value: game.shop?.name ?? '-' },
    {
      label: t('text-release-date'),
      value: game.release_date
        ? dayjs(game.release_date).format('DD.MM.YYYY')
        : '-'
    },
    {
      label: t('text-requires-internet'),
      value: game.requires_internet_connection ? t('text-yes') : t('text-no')
    },
    {
      label: t('text-genres'),
      value: game.genres?.map((g) => g.name).join(', ') || '-'
    },
    {
      label: t('text-platforms'),
      value:
        game.builds?.map((b) => getPlatformLabel(b.platform)).join(', ') || '-'
    }
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {t('text-game-details')}
      </h2>
      <div className="mt-4 grid grid-cols-[auto,1fr] gap-x-4 gap-y-2 text-gray-900 dark:text-gray-100">
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

export default GameDetailsView
