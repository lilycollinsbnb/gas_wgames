import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetStaticProps } from 'next'
import type { NextPageWithLayout } from '@/types'
import { useMemo, useState } from 'react'
import Layout from '@/layouts/_layout'
import Grid from '@/components/shop/grid'
import Seo from '@/layouts/_seo'
import routes from '@/config/routes'
import { useTopShops } from '@/data/shop'
import ButtonGroup from '@/components/ui/button-group'
import { useTranslation } from 'next-i18next'
import { debounce } from 'lodash'
import { SimpleSearchIcon } from '@/components/icons/simple-search-icon'

const MAP_RANGE_FILTER = [
  {
    label: 'text-weekly',
    range: 7
  },
  {
    label: 'text-monthly',
    range: 30
  },
  {
    label: 'text-yearly',
    range: 365
  }
]

// Every shop owner in an author here
function Shops() {
  const [selected, setRange] = useState<{ label: string; range: number }>(
    MAP_RANGE_FILTER[2]
  )
  const [searchText, setSearchText] = useState('')
  const { shops, loadMore, hasNextPage, isLoadingMore, isLoading } =
    useTopShops({
      range: selected.range,
      name: searchText
    })
  const { t } = useTranslation('common')

  const debouncedSearchHandler = useMemo(
    () =>
      debounce((value: string) => {
        setSearchText(value)
      }, 600),
    []
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearchHandler(e.target.value)
  }

  return (
    <div className="flex flex-grow flex-col px-4 pb-10 pt-6 md:px-6 lg:px-7 lg:pb-12 3xl:px-8">
      <div className="-mt-4 mb-2 flex flex-col-reverse flex-wrap items-center justify-between bg-light-200 py-4 dark:bg-dark-100 md:mb-5 md:mt-0 md:flex-row md:space-x-4 md:bg-transparent md:py-0 md:dark:bg-transparent lg:mb-7">
        <div className="relative mt-3 w-full max-w-xs sm:mt-0">
          <SimpleSearchIcon
            className="absolute left-1 top-1/2 -mt-2 h-4 w-4"
            aria-hidden="true"
          />
          <input
            type="search"
            onChange={(e) => handleSearchChange(e)}
            autoFocus={true}
            placeholder={t('text-placeholder-search')}
            className="border-dark-30 h-11 w-full border-0 border-b border-b-light-600 bg-transparent pl-8 text-13px outline-none focus:border-b-light-800 focus:ring-0 dark:border-b-dark-400 dark:focus:border-b-dark-500"
          />
        </div>
        <ButtonGroup
          items={MAP_RANGE_FILTER}
          selectedValue={selected}
          onChange={setRange}
        />
      </div>
      <Grid
        shops={shops}
        onLoadMore={loadMore}
        hasNextPage={hasNextPage}
        isLoadingMore={isLoadingMore}
        isLoading={isLoading}
      />
    </div>
  )
}

const AuthorsPage: NextPageWithLayout = () => {
  return (
    <>
      <Seo
        title="Top Asset Creators"
        description="Showcasing top asset creators for Godot Engine. We prioritize stores with the most sold assets, followed by sellers with the most assets. Sellers without published assets are not displayed."
        url={routes.authors}
        canonical={routes.authors}
      />
      <Shops />
    </>
  )
}

AuthorsPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common']))
    },
    revalidate: 60 * 60 // In seconds
  }
}

export default AuthorsPage
