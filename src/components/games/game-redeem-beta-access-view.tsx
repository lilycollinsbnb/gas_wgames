import React from 'react'
import { useModalAction, useModalState } from '../modal-views/context'
import Input from '../ui/forms/input'
import Button from '../ui/button'
import { useReedeemBetaAccessMutation } from '@/data/games'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { GameBuild, TargetPlatform } from '@/types'
import Select from '../ui/forms/select'
import getPlatformLabel from '@/lib/get-target-platform-label'

interface FormValues {
  code: string
  platform: TargetPlatform
}

export default function BetaAccessModal() {
  const { data } = useModalState()
  const { closeModal } = useModalAction()
  const { t } = useTranslation('common')
  const { redeemBetaAccess, isLoading } = useReedeemBetaAccessMutation()

  const builds = (data?.builds as GameBuild[]) || []
  const uniquePlatforms = Array.from(
    new Set(builds.map((build) => build.platform))
  )

  const hasPlatforms = uniquePlatforms.length > 0
  const defaultPlatform = hasPlatforms ? '' : 'windows'

  const schema = yup.object().shape({
    code: yup.string().required(t('text-access-code-required')),
    platform: yup
      .string()
      .required(t('text-platform-required'))
      .oneOf(
        [TargetPlatform.WINDOWS, ...uniquePlatforms],
        t('text-platform-required')
      )
  })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      platform: defaultPlatform as TargetPlatform
    }
  })

  const onSubmit = (formData: FormValues) => {
    redeemBetaAccess({
      code: formData.code,
      game_id: data.game_id,
      platform: formData.platform
    })
  }

  return (
    <div className="bg-light px-6 pb-8 pt-10 dark:bg-dark-300 sm:px-8 lg:p-12">
      <div className="relative z-10 flex items-center">
        <div className="w-full shrink-0 text-left md:w-[380px]">
          <h2 className="w-full text-xl md:text-2xl font-semibold text-dark-900 dark:text-light-100 mb-5">
            {t('text-redeem-beta-access')}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label={t('text-access-code')}
              {...register('code')}
              error={errors.code?.message}
              placeholder={t('access-code-input-placeholder')}
            />

            <Select
              label="text-platform"
              {...register('platform')}
              error={errors.platform?.message}
              options={
                hasPlatforms
                  ? [
                      { value: '', label: 'text-select-platform-placeholder' },
                      ...uniquePlatforms.map((p) => ({
                        value: p,
                        label: getPlatformLabel(p)
                      }))
                    ]
                  : [
                      {
                        value: TargetPlatform.WINDOWS,
                        label: getPlatformLabel(TargetPlatform.WINDOWS)
                      }
                    ]
              }
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
