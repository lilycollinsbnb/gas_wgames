import React from 'react'
import { useModalAction, useModalState } from '../modal-views/context'
import { useTranslation } from 'react-i18next'
import Button from '../ui/button'
import { useGame } from '@/data/games'
import { useRouter } from 'next/router'
import routes from '@/config/routes'

export default function RedeemBetaAccessConfirmationModal() {
  const { closeModal } = useModalAction()
  const { data } = useModalState()
  const { t } = useTranslation('common')
  const router = useRouter()

  const gameId = data?.gameId
  const { game, isLoading, error } = useGame(gameId, {
    enabled: Boolean(gameId)
  })

  const handleButtonClick = () => {
    router.push(routes.myGames)
    closeModal()
  }

  return (
    <div className="bg-light dark:bg-dark-300 rounded-lg shadow-lg max-w-md w-full mx-auto p-6 sm:p-8 flex flex-col items-center">
      <h2 className="mt-5 mb-4 text-center text-xl font-semibold text-dark-900 dark:text-light-100">
        {t('text-redeem-beta-access-confirmation')}
      </h2>

      {isLoading && (
        <p className="text-sm text-center text-dark-600 dark:text-light-400">
          {t('text-loading')}
        </p>
      )}

      {error && (
        <p className="text-sm text-center text-red-500">
          {t('text-something-went-wrong')}
        </p>
      )}

      {game && (
        <div className="flex flex-col items-center space-y-4 mt-4">
          <img
            src={game.image?.thumbnail || game.image?.original}
            alt={game.name}
            className="h-32 w-32 rounded-lg object-cover shadow-md"
          />
          <p className="text-lg font-medium text-dark-800 dark:text-light-200 text-center">
            {game.name}
          </p>
          <p className="text-sm text-dark-600 dark:text-light-400 text-center">
            {t('text-game-added-to-account')}
          </p>
        </div>
      )}

      <div className="mt-6 w-full">
        <Button onClick={handleButtonClick} className="w-full text-sm">
          {t('text-my-games')}
        </Button>
      </div>
    </div>
  )
}
