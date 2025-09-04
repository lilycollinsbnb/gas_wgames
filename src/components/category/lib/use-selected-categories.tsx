import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export const useSelectedCategories = () => {
  const router = useRouter()
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  )

  useEffect(() => {
    const categoriesFromQuery = router.query.categories as string | undefined
    if (categoriesFromQuery) {
      const selectedSlugs = new Set(categoriesFromQuery.split(','))
      setSelectedCategories(selectedSlugs)
    }
  }, [router.query.categories])

  const updateUrl = (selectedSlugs: Set<string>) => {
    const currentQuery = { ...router.query }

    if (selectedSlugs.size > 0) {
      currentQuery.categories = Array.from(selectedSlugs).join(',')
    } else {
      delete currentQuery.categories
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

  const handleCheckboxChange = (slug: string, isChecked: boolean) => {
    const updatedSelectedCategories = new Set(selectedCategories)
    if (isChecked) {
      updatedSelectedCategories.add(slug)
    } else {
      updatedSelectedCategories.delete(slug)
    }
    setSelectedCategories(updatedSelectedCategories)
    updateUrl(updatedSelectedCategories)
  }

  return { selectedCategories, handleCheckboxChange }
}
