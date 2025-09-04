import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import type { NextPageWithLayout, UpdateProfileInput } from '@/types'
import type { SubmitHandler } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import DashboardLayout from '@/layouts/_dashboard'
import { Form } from '@/components/ui/forms/form'
import Input from '@/components/ui/forms/input'
import Textarea from '@/components/ui/forms/textarea'
import { ReactPhone } from '@/components/ui/forms/phone-input'
import Button from '@/components/ui/button'
import client from '@/data/client'
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom'
import { useMe } from '@/data/user'
import pick from 'lodash/pick'
import { API_ENDPOINTS } from '@/data/client/endpoints'
import * as yup from 'yup'
import { useRouter } from 'next/router'

const ProfilePage: NextPageWithLayout = () => {
  const { t } = useTranslation('common')
  // const phoneRegExp = /^\+([0-9]{1,3})[-.\s()0-9]*$/;
  const profileValidationSchema = yup.object().shape({
    id: yup.string().required(),
    profile: yup.object().shape({
      fullname: yup.string().required(t('fullname-is-required-error')),
      contact: yup
        .string()
        // .matches(phoneRegExp, 'Invalid phone number format')
        .required(t('phone-number-is-required-error'))
    })
  })

  const queryClient = useQueryClient()
  const { me } = useMe()
  const router = useRouter()
  const language = router.locale

  const { mutate, isLoading } = useMutation(client.users.update, {
    onSuccess: () => {
      toast.success(<b>{t('text-profile-page-success-toast')}</b>, {
        className: '-mt-10 xs:mt-0'
      })
    },
    onError: (error) => {
      toast.error(<b>{t('text-profile-page-error-toast')}</b>, {
        className: '-mt-10 xs:mt-0'
      })
      console.log(error)
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.USERS_ME)
    }
  })
  const onSubmit: SubmitHandler<UpdateProfileInput> = (data) => mutate(data)

  return (
    <div className="flex min-h-full flex-grow flex-col">
      <h1 className="mb-5 text-15px font-medium text-dark dark:text-light sm:mb-6">
        {t('text-profile-page-title')}
      </h1>
      <Form<UpdateProfileInput>
        onSubmit={onSubmit}
        useFormProps={{
          defaultValues: pick(me, ['id', 'profile.fullname', 'profile.contact'])
        }}
        validationSchema={profileValidationSchema}
        className="flex flex-grow flex-col"
      >
        {({ register, reset, control, formState: { errors } }) => (
          <>
            <fieldset className="mb-6 grid gap-5 pb-5 sm:grid-cols-2 md:pb-9 lg:mb-8">
              <Input
                id="profile.fullname"
                label={t('text-profile-name')}
                {...register('profile.fullname')}
                error={errors.profile?.fullname?.message}
              />
              <div>
                <span className="block cursor-pointer pb-2.5 font-normal text-dark/70 dark:text-light/70">
                  {t('text-profile-contact')}
                </span>
                <Controller
                  name="profile.contact"
                  control={control}
                  render={({ field }) => (
                    <ReactPhone
                      inputProps={{ id: 'profile.contact' }}
                      country={language === 'en' ? 'us' : 'pl'}
                      {...field}
                    />
                  )}
                />

                {errors.profile?.contact?.message && (
                  <span
                    role="alert"
                    className="block pt-2 text-xs text-warning"
                  >
                    {'contact field is required'}
                  </span>
                )}
              </div>
            </fieldset>
            <div className="mt-auto flex items-center gap-4 pb-3 lg:justify-end">
              <Button
                type="reset"
                onClick={() =>
                  reset({
                    id: me?.id,
                    profile: {
                      fullname: me?.profile?.fullname,
                      contact: ''
                    }
                  })
                }
                disabled={isLoading}
                variant="outline"
                className="flex-1 lg:flex-none"
              >
                {t('text-cancel')}
              </Button>
              <Button
                aria-label="profile-save-changes"
                id="profile-save-changes-button"
                className="flex-1 lg:flex-none"
                isLoading={isLoading}
                disabled={isLoading}
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

ProfilePage.authorization = true
ProfilePage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common']))
    },
    revalidate: 15 * 60 // In seconds
  }
}

export default ProfilePage
