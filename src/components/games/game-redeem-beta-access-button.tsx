import cn from 'classnames'
import Button from '@/components/ui/button'
import { useModalAction } from '@/components/modal-views/context'
import { useTranslation } from 'react-i18next'
import { useMe } from '@/data/user'
import { GameBuild } from '@/types'

interface Props {
  className?: string
  gameId: string
  builds?: GameBuild[]
}

export default function RedeemBetaAccessButton({
  className,
  gameId,
  builds
}: Props) {
  const { openModal } = useModalAction()
  const { t } = useTranslation('common')
  const { me, isLoading } = useMe()

  return (
    <Button
      title="RedeemBetaAccessButton"
      id="redeem-beta-access-button"
      className={cn('relative pointer-events-auto cursor-pointer', className)}
      onClick={() => {
        if (isLoading) return
        if (me) {
          openModal('REDEEM_BETA_ACCESS_MODAL', { game_id: gameId, builds })
        } else {
          openModal('LOGIN_VIEW')
        }
      }}
      disabled={isLoading}
    >
      <div className="hover:text-brand">{t('text-redeem-beta-access')}</div>
    </Button>
  )
}
