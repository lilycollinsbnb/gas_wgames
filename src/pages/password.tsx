import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import type {
  ChangePasswordInput,
  NextPageWithLayout,
  SettingsQueryOptions
} from '@/types'
import type { SubmitHandler } from 'react-hook-form'
import { dehydrate, QueryClient, useMutation } from 'react-query'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import DashboardLayout from '@/layouts/_dashboard'
import { Form } from '@/components/ui/forms/form'
import Password from '@/components/ui/forms/password'
import Button from '@/components/ui/button'
import client from '@/data/client'
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom'
import * as yup from 'yup'
import { useState } from 'react'
import { API_ENDPOINTS } from '@/data/client/endpoints'

// export const getStaticProps = async () => {
//   const queryClient = new QueryClient();
//   await queryClient.prefetchQuery(
//     [API_ENDPOINTS.SETTINGS],
//     client.settings.all
//   );
//   return {
//     props: {
//       dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
//     },
//   };
// };

const ChangePasswordPage: NextPageWithLayout = () => {
  const { t } = useTranslation('common')

  const changePasswordSchema = yup.object().shape({
    oldPassword: yup.string().required(t('password-is-required-error')),
    newPassword: yup
      .string()
      .required(t('new-password-is-required-error'))
      .min(8, t('password-min-length-error'))
      .max(30, t('password-max-length-error'))
      .matches(
        /^(?=.*[a-z])/,
        t('password-one-lowercase-character-required-error')
      )
      .matches(
        /^(?=.*[A-Z])/,
        t('password-one-uppercase-character-required-error')
      )
      .matches(/^(?=.*[0-9])/, t('password-one-digit-required-error'))
      .matches(
        /^(?=.*[!@#\$%\^&\*])/,
        t('password-one-special-character-required-error')
      ),
    confirmPassword: yup
      .string()
      .oneOf(
        [yup.ref('newPassword')],
        t('confirm-new-password-must-match-error')
      )
      .required(t('confirm-password-is-required-error'))
  })

  let [error, setError] = useState<Partial<ChangePasswordInput> | null>(null)
  const { mutate, isLoading } = useMutation(client.users.changePassword, {
    onSuccess: (data) => {
      if (!data.success) {
        setError({ oldPassword: t('change-password-failed-error') })
        toast.error(<b>{t('change-password-failed-error')}</b>, {
          className: '-mt-10 xs:mt-0'
        })
        return
      }
      toast.success(<b>{t('change-password-successful')}</b>, {
        className: '-mt-10 xs:mt-0'
      })
    }
  })
  const onSubmit: SubmitHandler<ChangePasswordInput> = (data) => mutate(data)
  return (
    <div className="flex min-h-full flex-grow flex-col">
      <h1 className="mb-5 text-15px font-medium text-dark dark:text-light sm:mb-6">
        {t('text-password-page-title')}
      </h1>
      <Form<ChangePasswordInput & { confirmPassword: string }>
        onSubmit={onSubmit}
        validationSchema={changePasswordSchema}
        serverError={error}
        className="flex flex-grow flex-col"
      >
        {({ register, reset, formState: { errors } }) => (
          <>
            <fieldset className="mb-6 grid gap-5 pb-5 sm:grid-cols-2 md:pb-9 lg:mb-8">
              <Password
                id="old-password"
                label={t('text-current-password')}
                {...register('oldPassword')}
                error={errors.oldPassword?.message}
              />
              <Password
                id="new-password"
                label={t('text-new-password')}
                {...register('newPassword')}
                error={errors.newPassword?.message}
              />
              <Password
                id="confirm-password"
                label={t('text-confirm-password')}
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
              />
            </fieldset>
            <div className="mt-auto flex items-center gap-4 pb-3 lg:justify-end">
              <Button
                type="reset"
                variant="outline"
                disabled={isLoading}
                onClick={() => reset()}
                className="flex-1 lg:flex-none"
              >
                {t('text-cancel')}
              </Button>
              <Button
                aria-label="submit password"
                type="submit"
                id="submit-password"
                isLoading={isLoading}
                disabled={isLoading}
                className="flex-1 lg:flex-none"
              >
                {t('text-save-changes')}
              </Button>
            </div>
          </>
        )}
      </Form>
    </div>
  )
}

ChangePasswordPage.authorization = true
ChangePasswordPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery(
    [API_ENDPOINTS.SETTINGS, { language: locale }],
    ({ queryKey }) => client.settings.all(queryKey[1] as SettingsQueryOptions)
  )
  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      ...(await serverSideTranslations(locale!, ['common']))
    },
    revalidate: 15 * 60 // In seconds
  }
}

export default ChangePasswordPage
