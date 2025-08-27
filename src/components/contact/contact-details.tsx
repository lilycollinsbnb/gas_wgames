import { useTranslation } from 'next-i18next'
import { LocationIcon } from '@/components/icons/contact/location-icon'
import { PhoneIcon } from '@/components/icons/contact/phone-icon'
import { MailIcon } from '@/components/icons/contact/mail-icon'
import { useSettings } from '@/data/settings'

function ContactInfo({
  icon,
  title,
  description
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex max-w-xs flex-row items-center pr-4 sm:pr-2 lg:max-w-sm lg:pr-0">
      <div className="flex w-12 flex-shrink-0 justify-center text-brand">
        {icon}
      </div>
      <div className="mt-0 ltr:pl-5 rtl:pr-5">
        <h3 className="mb-2 text-15px font-medium text-dark dark:text-light">
          {title}
        </h3>
        <p className="leading-[1.8em]">{description}</p>
      </div>
    </div>
  )
}

const ContactDetails = () => {
  const { t } = useTranslation('common')
  const { settings } = useSettings()
  const { contactDetails } = settings ?? {}

  return (
    <div className="shrink-0 border-light-300 dark:border-dark-300 lg:w-[400px] lg:py-10 ltr:lg:border-r ltr:lg:pl-10 ltr:lg:pr-[72px] rtl:lg:border-l rtl:lg:pl-[72px] rtl:lg:pr-10 lg:dark:bg-dark-250 xl:w-[430px] xl:py-12 ltr:xl:pr-24 rtl:xl:pl-24">
      <h2 className="pb-2 text-lg font-medium text-dark dark:text-light md:text-xl">
        {t('contact-us-info-title')}
      </h2>
      <p className="font-medium leading-[1.8em]">
        {t('contact-us-info-subtitle')}
      </p>
      <div className="grid-cols-2 gap-x-5 gap-y-8 space-y-7 pt-9 sm:grid sm:space-y-0 md:gap-y-9 lg:block lg:space-y-9">
        <ContactInfo
          icon={<LocationIcon className="h-12 w-12" />}
          title={t('contact-us-office-title')}
          description={
            ''
            // contactDetails?.location?.formattedAddress ??
            // t('contact-us-office-message')
          }
        />
        <ContactInfo
          icon={<PhoneIcon className="h-10 w-10" />}
          title={t('contact-us-phone-title')}
          description={
            ''
            //  contactDetails?.contact ??
            // t('contact-us-phone-message')
          }
        />
        <ContactInfo
          icon={<MailIcon className="h-10 w-10" />}
          title={t('contact-us-site-title')}
          description={
            ''
            // contactDetails?.website ??
            // t('contact-us-site-message')
          }
        />
      </div>
    </div>
  )
}

export default ContactDetails
