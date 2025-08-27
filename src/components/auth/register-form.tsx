import * as yup from 'yup'
import type { SubmitHandler } from 'react-hook-form'
import type { RegisterUserInput } from '@/types'
import { useMutation } from 'react-query'
import toast from 'react-hot-toast'
import { Form } from '@/components/ui/forms/form'
import Password from '@/components/ui/forms/password'
import { useModalAction } from '@/components/modal-views/context'
import Input from '@/components/ui/forms/input'
import client from '@/data/client'
import Button from '@/components/ui/button'
import { RegisterBgPattern } from '@/components/auth/register-bg-pattern'
import { useState } from 'react'
import { useTranslation } from 'next-i18next'
// import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

export default function RegisterUserForm() {
  const { t: tCommon } = useTranslation('common')
  // const { executeRecaptcha } = useGoogleReCaptcha()
  const registerUserValidationSchema = yup.object().shape({
    name: yup
      .string()
      .max(20, tCommon('username-max-length-error'))
      .required(tCommon('username-is-required-error')),
    email: yup
      .string()
      .email(tCommon('email-not-valid-email-error'))
      .required(tCommon('email-is-required-error')),
    password: yup
      .string()
      .required(tCommon('password-is-required-error'))
      .min(8, tCommon('password-min-length-error'))
      .max(30, tCommon('password-max-length-error'))
      .matches(
        /^(?=.*[a-z])/,
        tCommon('password-one-lowercase-character-required-error')
      )
      .matches(
        /^(?=.*[A-Z])/,
        tCommon('password-one-uppercase-character-required-error')
      )
      .matches(/^(?=.*[0-9])/, tCommon('password-one-digit-required-error'))
      .matches(
        /^(?=.*[!@#\$%\^&\*])/,
        tCommon('password-one-special-character-required-error')
      ),
    confirmPassword: yup
      .string()
      .oneOf(
        [yup.ref('password')],
        tCommon('confirm-new-password-must-match-error')
      )
      .required(tCommon('confirm-password-is-required-error'))
  })

  const { openModal, closeModal } = useModalAction()
  let [serverError, setServerError] = useState<RegisterUserInput | null>(null)
  const { mutate } = useMutation(client.users.register, {
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(<b>{res.message}</b>, {
          className: '-mt-10 xs:mt-0',
          duration: 3500
        })
        return
      }
      toast.success(<b>{res.message}</b>, {
        className: '-mt-10 xs:mt-0',
        duration: 10000
      })
      closeModal()
    },
    onError: (err: any) => {
      console.log(err.response.data, 'error')
      setServerError(err.response.data)
    }
  })

  const onSubmit: SubmitHandler<RegisterUserInput> = async (data) => {
    let recaptchaToken = ''

    // if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
    //   if (!executeRecaptcha) {
    //     toast.error(<b>Unexpected error occured. Try again later.</b>, {
    //       className: '-mt-10 xs:mt-0',
    //       duration: 3500
    //     })
    //     return
    //   }

    //   try {
    //     recaptchaToken = await executeRecaptcha('register')
    //   } catch (err) {
    //     toast.error(<b>{tCommon('text-unexpected-error-occurred')}</b>, {
    //       className: '-mt-10 xs:mt-0',
    //       duration: 3500
    //     })
    //     return
    //   }
    // }

    mutate({ ...data, captcha_response: recaptchaToken })
  }
  return (
    <div className="bg-light px-6 pb-8 pt-10 dark:bg-dark-300 sm:px-8 lg:p-12">
      <RegisterBgPattern className="absolute bottom-0 left-0 text-light dark:text-dark-300 dark:opacity-60" />
      <div className="relative z-10 flex items-center">
        <div className="w-full shrink-0 text-left md:w-[380px]">
          <div className="flex flex-col pb-5 text-center lg:pb-9 xl:pb-10 xl:pt-2">
            <h2 className="text-lg font-medium tracking-[-0.3px] text-dark dark:text-light lg:text-xl">
              {tCommon('text-registration')}
            </h2>
            <div className="mt-1.5 text-13px leading-6 tracking-[0.2px] dark:text-light-900 lg:mt-2.5 xl:mt-3">
              {tCommon('text-create-an-account')}{' '}
              <button
                onClick={() => openModal('LOGIN_VIEW')}
                className="inline-flex font-semibold text-brand hover:text-dark-400 hover:dark:text-light-500"
              >
                {tCommon('text-login')}
              </button>
            </div>
          </div>

          <Form<RegisterUserInput & { confirmPassword: string }>
            onSubmit={onSubmit}
            validationSchema={registerUserValidationSchema}
            serverError={serverError}
            className="space-y-4 lg:space-y-5"
          >
            {({ register, formState: { errors } }) => (
              <>
                <Input
                  id="user-name"
                  label="register-username-field"
                  inputClassName="bg-light dark:bg-dark-300"
                  {...register('name')}
                  error={errors.name?.message}
                />
                <Input
                  id="user-email"
                  label="contact-us-email-field"
                  inputClassName="bg-light dark:bg-dark-300"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                />
                <Password
                  id="user-password"
                  label="text-auth-password"
                  inputClassName="bg-light dark:bg-dark-300"
                  {...register('password')}
                  error={errors.password?.message}
                />
                <Password
                  id="confirm-password"
                  label={'text-confirm-password'}
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
                />
                <Button
                  id="register-user"
                  type="submit"
                  className="!mt-5 w-full text-sm tracking-[0.2px] lg:!mt-7"
                >
                  {tCommon('text-register')}
                </Button>
              </>
            )}
          </Form>
        </div>
      </div>
    </div>
  )
}
