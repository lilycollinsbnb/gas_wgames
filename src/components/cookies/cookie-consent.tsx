import PageTitle from '@/layouts/_page-title'
import AnchorLink from '../ui/links/anchor-link'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

// Define type for the props
interface CookieConsentProps {
  onAccept: () => void
  onDecline: () => void
}

const CookieConsent: React.FC<CookieConsentProps> = ({
  onAccept,
  onDecline
}) => {
  const [isHidden, setIsHidden] = useState<boolean>(false)
  const { t } = useTranslation('common')

  const acceptCookies = () => {
    onAccept()
  }

  const declineCookies = () => {
    onDecline()
  }

  return (
    <div
      className={`${
        isHidden ? 'hide-on-mobile hidden' : ''
      } z-50 mx-1 my-auto mt-1 w-full rounded-2xl bg-light px-4 pb-3 pt-2 font-adlib text-light-100 dark:bg-dark-250`}
    >
      <div className="mt-5">
        <div className="flex justify-end">
          <button
            onClick={() => setIsHidden(true)}
            className="text-lg text-brand hover:text-mint"
          >
            x
          </button>
        </div>
        <PageTitle />
        <p className="mb-2 text-xs text-dark dark:text-light sm:text-sm md:text-base">
          {t('text-cookie-consent-part-1')}{' '}
          <AnchorLink
            href="/cookie-policy"
            className="text-blue-500 hover:text-mint"
          >
            {t('text-cookie-policy-page-title')}
          </AnchorLink>
          .{t('text-cookie-consent-part-2')}{' '}
          <AnchorLink href="/privacy" className="text-blue-500 hover:text-mint">
            {t('text-privacy-page-title')}
          </AnchorLink>
          .
        </p>
        <div className="mb-1 mt-1 flex justify-center gap-4">
          <button
            onClick={acceptCookies}
            aria-label="Press this button to allow Analytical Cookies"
            id="acceptcookies"
            className="h-6 bg-green-dark px-3 text-white transition hover:bg-green focus:outline-none"
          >
            {t('text-accept')}
          </button>
          <button
            onClick={declineCookies}
            aria-label="Press this button to opt out of Analytical Cookies"
            className="h-6 bg-red-dark px-3 text-white transition hover:bg-red focus:outline-none"
          >
            {t('text-decline')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CookieConsent
