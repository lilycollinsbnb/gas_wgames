import * as yup from 'yup'
import type { SubmitHandler } from 'react-hook-form'
import type {
  ForgetPasswordInput,
  ResetPasswordInput,
  VerifyForgetPasswordTokenInput
} from '@/types'
import toast from 'react-hot-toast'
import { Form } from '@/components/ui/forms/form'
import Input from '@/components/ui/forms/input'
import Password from '@/components/ui/forms/password'
import Button from '@/components/ui/button'
import { useModalAction } from '@/components/modal-views/context'
import { RegisterBgPattern } from '@/components/auth/register-bg-pattern'
import {
  StateMachineProvider,
  createStore,
  useStateMachine,
  GlobalState
} from 'little-state-machine'
import client from '@/data/client'
import { useMutation } from 'react-query'
import { useState } from 'react'
import { useTranslation } from 'next-i18next'
// import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

function EmailForm({
  email,
  serverError,
  onSubmit,
  isLoading
}: {
  email: string
  serverError?: { email?: string } | null
  onSubmit: SubmitHandler<ForgetPasswordInput>
  isLoading: boolean
}) {
  const { t } = useTranslation('common')

  const emailFormValidation = yup.object().shape({
    email: yup
      .string()
      .email(t('email-not-valid-email-error'))
      .required(t('email-is-required-error'))
  })

  const { openModal } = useModalAction()
  return (
    <div className="bg-light px-6 pb-8 pt-10 dark:bg-dark-300 sm:px-8 lg:p-12">
      <RegisterBgPattern className="absolute bottom-0 left-0 text-light dark:text-dark-300 dark:opacity-60" />
      <div className="relative z-10 flex items-center">
        <div className="w-full shrink-0 text-left md:w-[380px]">
          <div className="flex flex-col pb-5 text-center lg:pb-9 xl:pb-10 xl:pt-2">
            <h2 className="text-lg font-medium tracking-[-0.3px] text-dark dark:text-light lg:text-xl">
              {t('text-reset-password')}
            </h2>
            <div className="mt-1.5 text-13px leading-6 tracking-[0.2px] dark:text-light-900 lg:mt-2.5 xl:mt-3">
              {t('text-reset-password-title')}
            </div>
          </div>
          <Form<ForgetPasswordInput>
            onSubmit={onSubmit}
            useFormProps={{
              defaultValues: { email }
            }}
            serverError={serverError}
            validationSchema={emailFormValidation}
            className="text-left"
          >
            {({ register, formState: { errors } }) => (
              <>
                <Input
                  id="user-email"
                  label="contact-us-email-field"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message && 'text-email-notice'}
                />
                <Button
                  id="user-password-remind"
                  type="submit"
                  className="!mt-5 w-full text-sm tracking-[0.2px] lg:!mt-6"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {t('text-reset-password-submit')}
                </Button>
              </>
            )}
          </Form>
          <div className="relative mt-10 flex items-center justify-center border-t border-light-500 text-13px dark:border-dark-600">
            <span className="absolute inline-flex bg-light px-2 pb-0.5 dark:bg-dark-300">
              {t('text-or')}
            </span>
          </div>
          <div className="pt-7 text-center text-13px">
            {t('text-back-to')}{' '}
            <button
              type="button"
              className="font-semibold text-brand hover:text-dark-400 hover:dark:text-light-500"
              onClick={() => openModal('LOGIN_VIEW')}
            >
              {t('text-login')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function TokenForm({
  token,
  message,
  serverError,
  onSubmit,
  isLoading,
  onBack
}: {
  token: string
  message: string | null
  serverError: { token?: string } | null
  onSubmit: SubmitHandler<Pick<VerifyForgetPasswordTokenInput, 'token'>>
  isLoading: boolean
  onBack: () => void
}) {
  const { t } = useTranslation('common')

  const tokenFormValidation = yup.object().shape({
    token: yup.string().required(t('reset-password-token-is-required'))
  })

  return (
    <div className="px-6 pb-8 pt-10 sm:px-8 lg:p-12">
      <RegisterBgPattern className="absolute bottom-0 left-0 text-light dark:text-dark-300 dark:opacity-60" />
      <div className="relative z-10">
        {message && (
          <div className="flex flex-col pb-5 text-center lg:pb-9 xl:pb-10 xl:pt-2">
            <h2 className="text-lg font-medium tracking-[-0.3px] text-dark dark:text-light lg:text-xl">
              {t('text-check-email')}
            </h2>
            <div className="mt-1.5 text-13px leading-6 tracking-[0.2px] dark:text-light-900 lg:mt-2.5 xl:mt-3">
              {t('text-we-sent-reset-token')}
            </div>
          </div>
        )}
        <Form<Pick<VerifyForgetPasswordTokenInput, 'token'>>
          onSubmit={onSubmit}
          useFormProps={{
            defaultValues: { token }
          }}
          validationSchema={tokenFormValidation}
          serverError={serverError}
        >
          {({ register, formState: { errors } }) => (
            <div className="w-full xs:w-[380px]">
              <Input
                id="token-enter"
                label={t('text-enter-reset-password-token')}
                {...register('token')}
                error={errors.token?.message}
                className="text-left"
              />
              <div className="mt-7 grid grid-cols-2 gap-5 text-13px">
                <Button
                  type="reset"
                  variant="outline"
                  onClick={onBack}
                  id="back-button"
                >
                  {t('text-back')}
                </Button>
                <Button
                  id="verify-token"
                  type="submit"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {t('text-verify-token')}
                </Button>
              </div>
            </div>
          )}
        </Form>
      </div>
    </div>
  )
}

function PasswordForm({
  onSubmit,
  isLoading,
  onBack
}: {
  onSubmit: SubmitHandler<Pick<ResetPasswordInput, 'password'>>
  isLoading: boolean
  onBack: () => void
}) {
  const { t } = useTranslation('common')

  const passwordFormValidation = yup.object().shape({
    password: yup
      .string()
      .required(t('password-is-required-error'))
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
      )
  })

  return (
    <div className="px-6 pb-8 pt-10 sm:px-8 lg:p-12">
      <RegisterBgPattern className="absolute bottom-0 left-0 text-light dark:text-dark-300 dark:opacity-60" />
      <div className="relative z-10">
        <div className="flex flex-col pb-5 text-center lg:pb-9 xl:pb-10 xl:pt-2">
          <h2 className="text-lg font-medium tracking-[-0.3px] text-dark dark:text-light lg:text-xl">
            {t('text-reset-password')}
          </h2>
          <div className="mt-1.5 text-13px leading-6 tracking-[0.2px] dark:text-light-900 lg:mt-2.5 xl:mt-3">
            {t('text-reset-password-description')}
          </div>
        </div>
        <Form<Pick<ResetPasswordInput, 'password'>>
          onSubmit={onSubmit}
          useFormProps={{
            defaultValues: { password: '' }
          }}
          validationSchema={passwordFormValidation}
        >
          {({ register, formState: { errors } }) => (
            <div className="w-full xs:w-[380px]">
              <Password
                id="new-password"
                label={t('text-new-password')}
                {...register('password')}
                error={errors.password?.message}
                className="text-left"
              />
              <div className="mt-7 grid grid-cols-2 gap-5 text-13px">
                <Button type="reset" variant="outline" onClick={onBack}>
                  {t('text-back')}
                </Button>
                <Button
                  id="submit-password"
                  type="submit"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {t('text-send')}
                </Button>
              </div>
            </div>
          )}
        </Form>
      </div>
    </div>
  )
}

function RenderFormSteps() {
  // const { executeRecaptcha } = useGoogleReCaptcha()
  const { openModal } = useModalAction()
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<{ token?: string; email?: string } | null>(
    null
  )
  const { mutate: forgotPassword, isLoading } = useMutation(
    client.users.forgotPassword
  )
  const { mutate: verifyForgotPasswordToken, isLoading: verifying } =
    useMutation(client.users.verifyForgotPasswordToken)
  const { mutate: resetPassword, isLoading: resetting } = useMutation(
    client.users.resetPassword
  )
  // use hook for getting form state and actions
  const { state, actions } = useStateMachine({ updateFormState })
  const { t } = useTranslation('common')

  const emailFormHandle: SubmitHandler<ForgetPasswordInput> = async ({
    email
  }) => {
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

    forgotPassword(
      { email, captcha_response: recaptchaToken },
      {
        onSuccess: (data) => {
          if (!data.success) {
            setError({ email: data.message })
            return
          }
          setMessage(data.message)
          actions.updateFormState({
            email,
            step: 'Token'
          })
        }
      }
    )
  }

  const passwordFormHandle: SubmitHandler<
    Pick<ResetPasswordInput, 'password'>
  > = async ({ password }) => {
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
    resetPassword(
      {
        password,
        token: state.token,
        email: state.email,
        captcha_response: recaptchaToken
      },
      {
        onSuccess: (res) => {
          if (res.success) {
            actions.updateFormState({
              ...initialState
            })
            toast.success(<b>{t('change-password-successful')}</b>, {
              className: '-mt-10 xs:mt-0'
            })
            openModal('LOGIN_VIEW')
          }
        }
      }
    )
  }

  const tokenFormHandle: SubmitHandler<
    Pick<VerifyForgetPasswordTokenInput, 'token'>
  > = async ({ token }) => {
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

    verifyForgotPasswordToken(
      { token, email: state.email, captcha_response: recaptchaToken },
      {
        onSuccess: (res) => {
          if (!res.success) {
            setError({ token: t('verify-reset-token-error') })
            return
          }
          actions.updateFormState({
            step: 'Password',
            token
          })
        }
      }
    )
  }
  function backToPreviousStep(step: GlobalState['step']) {
    actions.updateFormState({
      step
    })
  }
  return (
    <div>
      {state.step === 'Email' && (
        <EmailForm
          email={state.email}
          onSubmit={emailFormHandle}
          serverError={error}
          isLoading={isLoading}
        />
      )}
      {state.step === 'Token' && (
        <TokenForm
          token={state.token}
          onSubmit={tokenFormHandle}
          message={message}
          serverError={error}
          isLoading={verifying}
          onBack={() => backToPreviousStep('Email')}
        />
      )}
      {state.step === 'Password' && (
        <PasswordForm
          onSubmit={passwordFormHandle}
          isLoading={resetting}
          onBack={() => backToPreviousStep('Token')}
        />
      )}
    </div>
  )
}

const initialState: GlobalState = {
  step: 'Email',
  email: '',
  password: '',
  token: ''
}
//@ts-ignore
createStore(initialState)

const updateFormState = (
  state: typeof initialState,
  payload: {
    step: 'Email' | 'Token' | 'Password' | 'Success' | 'Error'
    [key: string]: string
  }
) => {
  return {
    ...state,
    ...payload
  }
}

export default function ForgotUserPassword() {
  return (
    <StateMachineProvider>
      <RenderFormSteps />
    </StateMachineProvider>
  )
}
