import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import type { License, NextPageWithLayout } from '@/types'
import MarkdownRenderer from '@/components/ui/markdown-renderer'
import Layout from '@/layouts/_layout'
import client from '@/data/client'
import ItemNotFound from '@/components/ui/item-not-found'

interface LicensePageProps {
  license?: License
}

const LicensePage: NextPageWithLayout<LicensePageProps> = ({ license }) => {
  const { t } = useTranslation('common')

  if (!license) {
    return (
      <>
        <ItemNotFound
          title={t('text-license-not-found')}
          message={t('text-license-not-found-message')}
          className="px-4 pb-10 pt-5 md:px-6 md:pt-6 lg:px-7 lg:pb-12 3xl:px-8"
        />
      </>
    )
  }

  return (
    <>
      <div className="mx-auto  flex h-full w-full max-w-screen-xl flex-col p-4 sm:p-6">
        <h1 className="text-center text-3xl font-semibold mb-4">
          {license.name}
        </h1>
        <MarkdownRenderer content={license.content} />
      </div>
    </>
  )
}

LicensePage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale
}) => {
  try {
    const id = query.id as string | undefined
    const license = await client.licenses.get({
      id: id ?? '',
      language: locale
    })

    return {
      props: {
        license,
        ...(await serverSideTranslations(locale!, ['common']))
      }
    }
  } catch (error) {
    return {
      props: {
        license: null,
        ...(await serverSideTranslations(locale!, ['common']))
      }
    }
  }
}

export default LicensePage
