// components/beta-access/BetaAccessPlatformModal.tsx
import React from 'react'
import { useModalAction, useModalState } from '../modal-views/context'
import Button from '../ui/button'
import Select from '../ui/forms/select'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { TargetPlatform, GameBuild } from '@/types'
import getPlatformLabel from '@/lib/get-target-platform-label'
import { useReedeemBetaAccessMutation } from '@/data/games'

interface FormValues {
  platform: TargetPlatform
}

export default function SelectBetaAccessPlatformModal() {
  const { data } = useModalState()
  const { closeModal } = useModalAction()
  const { t } = useTranslation('common')
  const { redeemBetaAccess, isLoading, error } = useReedeemBetaAccessMutation()

  const builds = (data?.builds as GameBuild[]) || []
  const uniquePlatforms = Array.from(new Set(builds.map((b) => b.platform)))

  const schema = yup.object().shape({
    platform: yup
      .string()
      .required(t('text-platform-required'))
      .oneOf(uniquePlatforms, t('text-platform-required'))
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: yupResolver(schema)
  })

  const onSubmit = (formData: FormValues) => {
    redeemBetaAccess({
      code: data.code,
      game_id: data.game_id,
      platform: formData.platform
    })
  }

  return (
    <div className="bg-light px-6 pb-8 pt-10 dark:bg-dark-300 sm:px-8 lg:p-12">
      {/* Game header */}
      {data?.game && (
        <div className="flex items-center gap-4 mb-6">
          <div className="w-full max-w-[200px] rounded overflow-hidden shadow-md">
            <img
              src={data.game.image?.thumbnail ?? data.game.image?.original}
              alt={data.game.name}
              className="w-full h-auto object-contain"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-xl font-semibold text-dark-900 dark:text-light-100">
              {data.game.name}
            </h2>
          </div>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm mb-2">
          {t('text-redeem-beta-access-error')}
        </p>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        aria-busy={isSubmitting || isLoading}
      >
        <Select
          label={t('text-platform')}
          {...register('platform')}
          error={errors.platform?.message}
          options={[
            { value: '', label: t('text-select-platform-placeholder') },
            ...uniquePlatforms.map((p) => ({
              value: p,
              label: getPlatformLabel(p)
            }))
          ]}
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
            disabled={isSubmitting || isLoading}
            isLoading={isSubmitting || isLoading}
            className="w-full text-sm"
          >
            {t('text-download')}
          </Button>
        </div>
      </form>
    </div>
  )
}
