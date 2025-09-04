import React, { useState } from 'react'
import { useModalAction } from '../modal-views/context'
import Input from '../ui/forms/input'
import Button from '../ui/button'
import { useTranslation } from 'react-i18next'
import { useRedeemBetaAccess } from '@/data/games'

export default function BetaAccessModal() {
  const { closeModal } = useModalAction()
  const { t } = useTranslation('common')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { redeem } = useRedeemBetaAccess()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!code) {
      setError(t('text-access-code-required'))
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      await redeem(code)
    } catch (err: any) {
      setError(err.message || t('text-something-went-wrong'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-light px-6 pb-8 pt-10 dark:bg-dark-300 sm:px-8 lg:p-12">
      <div className="relative z-10 flex items-center">
        <div className="w-full shrink-0 text-left md:w-[380px]">
          <h2 className="w-full text-xl md:text-2xl font-semibold text-dark-900 dark:text-light-100 mb-5">
            {t('text-redeem-beta-access')}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label={t('text-access-code')}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              error={error || undefined}
              placeholder={t('access-code-input-placeholder')}
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                className="w-full text-sm"
              >
                {t('text-cancel')}
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                isLoading={isLoading}
                className="w-full text-sm"
              >
                {t('text-submit')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
