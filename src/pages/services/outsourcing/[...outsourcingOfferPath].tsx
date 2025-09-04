import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type {
  BreadcrumbItem,
  NextPageWithLayout,
  OutsourcingOffer
} from '@/types'
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType
} from 'next'
import Layout from '@/layouts/_layout'
import Seo from '@/layouts/_seo'
import MarkdownRenderer from '@/components/ui/markdown-renderer'
import routes from '@/config/routes'
import { useTranslation } from 'next-i18next'
import StaticBreadcrumbs from '@/components/ui/links/static-breadcrumbs'
import ContentGrid from '@/components/content/content-grid'
import client from '@/data/client'

type ParsedQueryParams = {
  outsourcingOfferPath?: string[]
}

type PageProps = {
  offer: OutsourcingOffer
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const paths: {
    params: { outsourcingOfferPath: string[] }
    locale: string
  }[] = []

  for (const locale of locales || []) {
    const offerPaginator = await client.outsourcing.all({
      limit: 100,
      language: locale
    })
    const offers = offerPaginator.data

    offers.forEach((offer) => {
      paths.push({
        params: {
          outsourcingOfferPath: offer.url.replace(/^\/+/, '').split('/')
        },
        locale
      })
    })
  }

  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps<
  PageProps,
  ParsedQueryParams
> = async ({ params, locale }) => {
  try {
    const segments = params?.outsourcingOfferPath || []
    const slug = segments[segments.length - 1]
    const outsourcingOffer = await client.outsourcing.get({
      slug: slug,
      language: locale
    })
    return {
      props: {
        offer: outsourcingOffer,
        ...(await serverSideTranslations(locale!, ['common']))
      },
      revalidate: 30 * 60
    }
  } catch (error) {
    console.error('Error fetching outsourcing offer:', error)
    return {
      notFound: true,
      revalidate: 30 * 60
    }
  }
}

const OutsourcingPage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ offer }) => {
  const { t } = useTranslation('common')
  const fullBreadcrumbs: BreadcrumbItem[] = [
    {
      label: t('text-services'),
      href: routes.services
    },
    {
      label: t('text-outsourcing'),
      href: routes.outsourcing
    },
    ...offer.breadcrumbs.map((item) => {
      return { label: item.label, href: routes.outsourcingOffer(item.href) }
    })
  ]

  return (
    <>
      <Seo
        title={offer.title}
        description={offer.description}
        url={routes.outsourcingOffer(offer.url)}
        canonical={routes.outsourcingOffer(offer.url)}
      />
      <div className="w-full px-4 pt-5 md:px-6 md:pt-6 lg:px-7 3xl:px-8">
        <h1 className="text-lg mb-5 font-bold text-gray-900 dark:text-gray-100">
          {offer.title}
        </h1>
        <StaticBreadcrumbs items={fullBreadcrumbs} />
      </div>

      {offer.children && offer.children.length > 0 && (
        <ChildrenList offers={offer.children} />
      )}

      <div className="w-full mt-5 px-4 pb-9 md:px-6 md:pb-10 lg:px-7 lg:pb-12 3xl:px-8">
        <MarkdownRenderer
          allowHtml={true}
          sanitizeHtml={true}
          enableMarkdownPreprocessing={true}
          content={offer.content ?? ''}
        />
      </div>
    </>
  )
}

function mapOffersToContentItems(
  offers: OutsourcingOffer[],
  t: (key: string) => string
) {
  return offers.map((offer) => ({
    id: offer.url,
    title: offer.title,
    image: offer.image?.original,
    description: offer.description,
    redirectLink: routes.outsourcingOffer(offer.url)
  }))
}

const ChildrenList = ({ offers }: { offers: OutsourcingOffer[] }) => {
  const { t } = useTranslation('common')
  const items = mapOffersToContentItems(offers, t)

  return (
    <ContentGrid
      items={items}
      isLoading={false}
      hasNextPage={false}
      onLoadMore={undefined}
      compact={true}
      notFoundTitle={t('text-offers-not-found')}
      notFoundMessage={t('text-offers-not-found-message')}
    />
  )
}

OutsourcingPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default OutsourcingPage
