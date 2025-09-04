import * as yup from 'yup'
import type { SubmitHandler } from 'react-hook-form'
import type { LoginUserInput } from '@/types'
import { Form } from '@/components/ui/forms/form'
import Password from '@/components/ui/forms/password'
import Input from '@/components/ui/forms/input'
import Button from '@/components/ui/button'
import { useModalAction } from '@/components/modal-views/context'
import CheckBox from '@/components/ui/forms/checkbox'
import { RegisterBgPattern } from '@/components/auth/register-bg-pattern'
import { useTranslation } from 'next-i18next'
import OAuthLoginPanel from './oauth-login-panel'
import useLoginMutation from './lib/use-login'
import toast from 'react-hot-toast'
// import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

export default function LoginUserForm() {
  const { t } = useTranslation('common')
  // const { executeRecaptcha } = useGoogleReCaptcha()
  const loginValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email(t('email-not-valid-email-error'))
      .required(t('email-is-required-error')),
    password: yup.string().required(t('password-is-required-error'))
  })
  const { openModal, closeModal } = useModalAction()
  const { mutate: login } = useLoginMutation()

  const onSubmit: SubmitHandler<LoginUserInput> = async (data) => {
    let recaptchaToken = ''

    // if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
    //   if (!executeRecaptcha) {
    //     toast.error(<b>{t('text-unexpected-error-occurred')}</b>, {
    //       className: '-mt-10 xs:mt-0',
    //       duration: 3500
    //     })
    //     return
    //   }

    //   try {
    //     recaptchaToken = await executeRecaptcha('login')
    //   } catch (err) {
    //     toast.error(<b>{t('text-unexpected-error-occurred')}</b>, {
    //       className: '-mt-10 xs:mt-0',
    //       duration: 3500
    //     })
    //     return
    //   }
    // }

    login(
      { ...data, captcha_response: recaptchaToken },
      {
        onSuccess: () => {
          closeModal()
        }
      }
    )
  }
  return (
    <div className="bg-light px-6 pb-8 pt-10 dark:bg-dark-300 sm:px-8 lg:p-12">
      <RegisterBgPattern className="absolute bottom-0 left-0 text-light dark:text-dark-300 dark:opacity-60" />
      <div className="relative z-10 flex items-center">
        <div className="w-full shrink-0 text-left md:w-[380px]">
          <div className="flex flex-col pb-5 text-center xl:pb-6 xl:pt-2">
            <h2 className="text-lg font-medium tracking-[-0.3px] text-dark dark:text-light lg:text-xl">
              {t('text-welcome-login')}
            </h2>
            <div className="mt-1.5 text-13px leading-6 tracking-[0.2px] dark:text-light-900 lg:mt-2.5 xl:mt-3">
              {t('text-join-now')}{' '}
              <button
                onClick={() => openModal('REGISTER')}
                className="inline-flex font-semibold text-brand hover:text-dark-400 hover:dark:text-light-500"
                id="register-user"
              >
                {t('text-create-account')}
              </button>
            </div>
          </div>
          <Form<LoginUserInput>
            onSubmit={onSubmit}
            validationSchema={loginValidationSchema}
            className="space-y-4 pt-4 lg:space-y-5"
          >
            {({ register, formState: { errors } }) => (
              <>
                <Input
                  label="contact-us-email-field"
                  inputClassName="bg-light dark:bg-dark-300"
                  id="user-email"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                />
                <Password
                  label="text-auth-password"
                  inputClassName="bg-light dark:bg-dark-300"
                  id="user-password"
                  {...register('password')}
                  error={errors.password?.message}
                />
                <div className="flex items-center justify-between space-x-5 rtl:space-x-reverse">
                  <CheckBox
                    label="text-remember-me"
                    // inputClassName="bg-light dark:bg-dark-300"
                  />
                  <button
                    id="user-forgot-password"
                    type="button"
                    className="text-13px font-semibold text-brand hover:text-dark-400 hover:dark:text-light-500"
                    onClick={() => openModal('FORGOT_PASSWORD_VIEW')}
                  >
                    {t('text-forgot-password')}
                  </button>
                </div>
                <Button
                  id="user-login"
                  type="submit"
                  className="!mt-5 w-full text-sm tracking-[0.2px] lg:!mt-7"
                >
                  {t('text-get-login')}
                </Button>
              </>
            )}
          </Form>
          <OAuthLoginPanel />
        </div>
      </div>
    </div>
  )
}
