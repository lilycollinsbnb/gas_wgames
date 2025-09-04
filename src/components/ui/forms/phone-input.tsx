import 'react-phone-input-2/lib/style.css'
import ReactPhone from 'react-phone-input-2'
import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { useRouter } from 'next/router'

const phoneNumberAtom = atom('')
export function usePhoneInput() {
  let [phoneNumber, setPhoneNumber] = useAtom(phoneNumberAtom)
  return {
    phoneNumber,
    setPhoneNumber
  }
}

export default function PhoneInput({
  className,
  defaultValue
}: {
  className?: string
  defaultValue?: string
}) {
  let { phoneNumber, setPhoneNumber } = usePhoneInput()
  const router = useRouter()
  const language = router.locale

  useEffect(() => {
    if (defaultValue) {
      setPhoneNumber(defaultValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className={className}>
      <ReactPhone
        country={language === 'en' ? 'us' : 'pl'}
        value={phoneNumber}
        onChange={(value) => setPhoneNumber(value)}
      />
    </div>
  )
}

export { ReactPhone }
