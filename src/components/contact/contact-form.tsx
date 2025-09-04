import { Form } from '@/components/ui/forms/form'
import Input from '@/components/ui/forms/input'
import Textarea from '@/components/ui/forms/textarea'
import * as yup from 'yup'
import Button from '@/components/ui/button'
import { CreateContactUsInput } from '@/types'
import { useTranslation } from 'next-i18next'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { useMutation } from 'react-query'
import client from '@/data/client'
import type { SubmitHandler } from 'react-hook-form'
// import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { LongRightArrowIcon } from '../icons/long-arrow-right-icon'

const contactUsFormSchema = yup.object().shape({
  contact_info: yup.string().required(),
  message: yup.string().required()
})

const ContactForm = () => {
  const { t } = useTranslation('common')
  // const { executeRecaptcha } = useGoogleReCaptcha()
  let [reset, setReset] = useState<CreateContactUsInput | null>(null)
  const { mutate } = useMutation(client.settings.contactUs, {
    onSuccess: () => {
      toast.success('Successfully sent your message', {
        duration: 8000 // duration in milliseconds
      })
      setReset({
        contact_info: '',
        message: ''
      })
    },
    onError: (res) => {
      toast.error('Ops! something went wrong', {
        duration: 6000 // duration in milliseconds
      })
    }
  })
  const onSubmit: SubmitHandler<CreateContactUsInput> = async (values) => {
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
    mutate({ ...values, captcha_response: recaptchaToken })
  }
  return (
    <div className="w-full flex-grow pt-12 lg:p-10 xl:p-12">
      <Form<CreateContactUsInput>
        onSubmit={onSubmit}
        validationSchema={contactUsFormSchema}
        resetFields={reset}
      >
        {({ register, formState: { errors } }) => (
          <>
            <fieldset className="mb-6 grid gap-5 sm:grid-cols-2">
              <Input
                id="user-email"
                label={t('contact-us-contact-info')}
                type="email"
                {...register('contact_info')}
                error={errors.contact_info?.message}
                className="sm:col-span-2"
                inputClassName="bg-gray-300 dark:bg-dark-500"
                labelClassName="dark:text-white font-bold text-base"
              />
              <Textarea
                id="message"
                label={t('contact-us-message-field')}
                {...register('message')}
                error={errors.message?.message}
                className="sm:col-span-2"
                inputClassName="bg-gray-300 dark:bg-dark-500"
                labelClassName="dark:text-white font-bold text-base"
              />
            </fieldset>
            <div className="flex flex-col justify-center">
              <Button
                id="submit-button"
                type="submit"
                className="mb-1 w-full flex-1 sm:flex-none md:w-auto text-base"
              >
                {t('contact-us-submit-button')}
                <LongRightArrowIcon className="w-4 h-4" />
              </Button>
              <p className="text-base text-muted-foreground mb-3 text-center">
                {t('text-we-will-get-back-to-you')}{' '}
                <strong>{t('text-contact-time')}</strong>
              </p>
            </div>
          </>
        )}
      </Form>
    </div>
  )
}

export default ContactForm
