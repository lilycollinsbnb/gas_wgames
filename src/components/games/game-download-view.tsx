import React from 'react'
import { useModalAction, useModalState } from '../modal-views/context'
import Button from '../ui/button'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { GameBuild, TargetPlatform } from '@/types'
import { useMutation } from 'react-query'
import client from '@/data/client'
import { download } from '@/lib/download-asset'
import Select from '../ui/forms/select'
import getPlatformLabel from '@/lib/get-target-platform-label'

interface FormValues {
  platform: TargetPlatform
}

export default function GameDownloadView() {
  const { data } = useModalState()
  const { closeModal } = useModalAction()
  const { t } = useTranslation('common')

  const builds = (data?.builds as GameBuild[]) || []
  const uniquePlatforms = Array.from(new Set(builds.map((b) => b.platform)))

  const hasPlatforms = uniquePlatforms.length > 0

  const options = hasPlatforms
    ? uniquePlatforms.map((platform) => ({
        value: platform,
        label: getPlatformLabel(platform)
      }))
    : [
        {
          value: TargetPlatform.WINDOWS,
          label: getPlatformLabel(TargetPlatform.WINDOWS)
        }
      ]

  const defaultPlatform = options[0].value

  const schema = yup.object().shape({
    platform: yup
      .string()
      .required(t('text-platform-required'))
      .oneOf(
        options.map((opt) => opt.value),
        t('text-platform-required')
      )
  })

  const {
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      platform: defaultPlatform
    }
  })

  const { mutate: getDownloadLink, isLoading } = useMutation(
    client.orders.generateDownloadGameLink,
    {
      onSuccess: (res) => download(res)
    }
  )

  const onSubmit = (formData: FormValues) => {
    getDownloadLink({
      id: data.game_id,
      platform: formData.platform
    })
  }

  return (
    <div className="bg-light px-6 pb-8 pt-10 dark:bg-dark-300 sm:px-8 lg:p-12">
      <div className="relative z-10 flex items-center">
        <div className="w-full shrink-0 text-left md:w-[380px]">
          <h2 className="mb-5 w-full text-xl font-semibold text-dark-900 dark:text-light-100 md:text-2xl">
            {t('text-download-game')}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Select
                label={t('text-platform')}
                options={options}
                error={errors.platform?.message}
                onChange={(e) =>
                  setValue('platform', e.target.value as TargetPlatform)
                }
                className="text-sm"
                selectClassName="bg-white dark:bg-dark-100"
              />
            </div>

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
                {t('text-download')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
