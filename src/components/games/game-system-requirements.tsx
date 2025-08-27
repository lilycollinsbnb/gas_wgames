import { HardwareSpecifications, SystemRequirements } from '@/types'
import { useTranslation } from 'next-i18next'

type Props = {
  requirements: SystemRequirements
}

const GameSystemRequirements: React.FC<Props> = ({ requirements }) => {
  const { t } = useTranslation('common')

  return (
    <div className="mt-6 grid grid-cols-2 gap-8 text-sm text-gray-900 dark:text-gray-100">
      <div>
        <h3 className="mb-4 text-lg font-semibold">
          {t('text-minimum-requirements')}
        </h3>
        <HardwareSpecificationsView specs={requirements?.minimum} />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">
          {t('text-recommended-requirements')}
        </h3>
        <HardwareSpecificationsView specs={requirements?.recommended} />
      </div>
    </div>
  )
}

type HardwareSpecificationsViewProps = {
  specs: HardwareSpecifications | undefined
}

const HardwareSpecificationsView: React.FC<HardwareSpecificationsViewProps> = ({
  specs
}) => {
  const { t } = useTranslation('common')

  const rows = [
    { label: t('text-operating-system'), value: specs?.os ?? '-' },
    { label: t('text-cpu'), value: specs?.cpu ?? '-' },
    { label: t('text-gpu'), value: specs?.gpu ?? '-' },
    { label: t('text-ram'), value: specs?.ram ?? '-' },
    { label: t('text-storage'), value: specs?.storage ?? '-' }
  ]

  return (
    <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2">
      {rows.map((row) => (
        <div key={row.label} className="contents">
          <span className="font-semibold">{row.label}:</span>
          <span>{row.value}</span>
        </div>
      ))}
    </div>
  )
}

export default GameSystemRequirements
