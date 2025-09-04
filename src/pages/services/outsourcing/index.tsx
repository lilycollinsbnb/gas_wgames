import type { GetStaticProps } from 'next'
import type {
  BreadcrumbItem,
  NextPageWithLayout,
  OutsourcingOffer
} from '@/types'
import Layout from '@/layouts/_layout'
import Seo from '@/layouts/_seo'
import routes from '@/config/routes'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import ContentGrid from '@/components/content/content-grid'
import { useTranslation } from 'next-i18next'
import matter from 'gray-matter'
import MarkdownRenderer from '@/components/ui/markdown-renderer'
import StaticBreadcrumbs from '@/components/ui/links/static-breadcrumbs'
import client from '@/data/client'

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const outsourcingOffers = await client.outsourcing.topLevel(locale)
    const outsourcingPageContent = await client.services.get({
      slug: 'outsourcing',
      language: locale
    })

    return {
      props: {
        outsourcingOffers: outsourcingOffers,
        title: outsourcingPageContent.title || 'Outsourcing',
        description: outsourcingPageContent.description || '',
        markdownContent: outsourcingPageContent.content || '',
        ...(await serverSideTranslations(locale!, ['common']))
      },
      revalidate: 30 * 60 // 30 minutes
    }
  } catch (error) {
    console.error('Error in getStaticProps:', error)

    return {
      props: {
        outsourcingOffers: [],
        title: 'Outsourcing',
        description: '',
        markdownContent: '',
        ...(await serverSideTranslations(locale!, ['common']))
      },
      revalidate: 30 * 60 // 30 minutes
    }
  }
}

function mapOutsourcingOffersToContentItems(
  outsourcingOffers: OutsourcingOffer[]
) {
  return outsourcingOffers.map((offer) => ({
    id: offer.slug,
    title: offer.title,
    image: offer.image?.original,
    description: offer.description,
    redirectLink: routes.outsourcingOffer(offer.url)
  }))
}

function Content({
  outsourcingOffers
}: {
  outsourcingOffers: OutsourcingOffer[]
}) {
  const { t } = useTranslation('common')
  const items = mapOutsourcingOffersToContentItems(outsourcingOffers)

  return (
    <ContentGrid
      items={items}
      isLoading={false}
      hasNextPage={false}
      onLoadMore={undefined}
      compact={true}
      notFoundTitle={t('text-outsourcing-not-found')}
      notFoundMessage={t('text-outsourcing-not-found-message')}
    />
  )
}

interface OutsourcingPageProps {
  outsourcingOffers: OutsourcingOffer[]
  title: string
  description: string
  markdownContent: string
}

const OutsourcingPage: NextPageWithLayout<OutsourcingPageProps> = ({
  outsourcingOffers,
  title,
  description,
  markdownContent
}) => {
  const { t } = useTranslation('common')
  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: t('text-services'),
      href: routes.services
    },
    {
      label: t('text-outsourcing'),
      href: routes.outsourcing
    }
  ]
  return (
    <>
      <Seo
        title={title}
        description={description}
        url={routes.outsourcing}
        canonical={routes.outsourcing}
      />
      <div className="px-4 pt-5 md:px-6 md:pt-6 lg:px-7 3xl:px-8">
        <h1 className="mb-5 text-lg font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h1>
        <StaticBreadcrumbs items={breadcrumbs} />
      </div>
      <Content outsourcingOffers={outsourcingOffers} />
      <div className="mx-auto h-full w-full px-4 md:px-6 lg:px-7 3xl:px-8 mb-5">
        <MarkdownRenderer
          allowHtml={true}
          sanitizeHtml={true}
          enableMarkdownPreprocessing={true}
          content={markdownContent}
        />
      </div>
    </>
  )
}

OutsourcingPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default OutsourcingPage
