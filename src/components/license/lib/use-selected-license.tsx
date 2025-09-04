import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export const useSelectedLicense = () => {
  const router = useRouter()
  const [selectedLicense, setSelectedLicense] = useState<string>('')

  useEffect(() => {
    const licenseFromQuery = router.query.license as string | undefined
    if (licenseFromQuery) {
      setSelectedLicense(licenseFromQuery)
    } else {
      setSelectedLicense('')
    }
  }, [router.query.license])

  const updateUrl = (newLicense: string | null) => {
    const currentQuery = { ...router.query }
    if (newLicense) {
      currentQuery.license = newLicense
    } else {
      delete currentQuery.license
    }

    router.push(
      {
        pathname: router.pathname,
        query: currentQuery
      },
      undefined,
      { shallow: true }
    )
  }

  const handleLicenseChange = (newLicense: string) => {
    setSelectedLicense(newLicense)
    updateUrl(newLicense)
  }

  return { selectedLicense, handleLicenseChange }
}
