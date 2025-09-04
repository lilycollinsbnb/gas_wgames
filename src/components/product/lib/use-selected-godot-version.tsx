import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export const useSelectedGodotVersion = () => {
  const router = useRouter()
  const [selectedVersion, setSelectedVersion] = useState<string>('')

  useEffect(() => {
    const versionFromQuery = router.query.version as string | undefined
    if (versionFromQuery) {
      setSelectedVersion(versionFromQuery)
    } else {
      setSelectedVersion('')
    }
  }, [router.query.version])

  const updateUrl = (newVersion: string | null) => {
    const currentQuery = { ...router.query }
    if (newVersion) {
      currentQuery.version = newVersion
    } else {
      delete currentQuery.version
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

  const handleVersionChange = (newVersion: string) => {
    setSelectedVersion(newVersion)
    updateUrl(newVersion)
  }

  return { selectedVersion, handleVersionChange }
}
