import type { GetStaticProps } from 'next'
import type { NextPageWithLayout, Service } from '@/types'
import Layout from '@/layouts/_layout'
import Seo from '@/layouts/_seo'
import routes from '@/config/routes'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import ContentGrid from '@/components/content/content-grid'
import { useTranslation } from 'next-i18next'
import MarkdownRenderer from '@/components/ui/markdown-renderer'
import client from '@/data/client'

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const services = await client.services.all({ language: locale })

    const staticPageContentDto = await client.staticPages.get({
      slug: 'services',
      language: locale
    })

    return {
      props: {
        services: services.data,
        title: staticPageContentDto.title,
        description: staticPageContentDto.description,
        markdownContent: staticPageContentDto.content,
        ...(await serverSideTranslations(locale!, ['common']))
      },
      revalidate: 30 * 60 // 30 minutes
    }
  } catch (error) {
    console.error('Error in getStaticProps:', error)

    return {
      props: {
        services: [],
        title: 'Services',
        description: '',
        markdownContent: '',
        ...(await serverSideTranslations(locale!, ['common']))
      },
      revalidate: 30 * 60 // 30 minutes
    }
  }
}

function mapServicesToContentItems(services: Service[]) {
  return services.map((service) => ({
    id: service.slug,
    title: service.title,
    image: service.image?.original,
    description: service.description,
    redirectLink: routes.service(service.slug),
    footer: undefined
  }))
}

function Grid({ services }: { services: Service[] }) {
  const { t } = useTranslation('common')
  const items = mapServicesToContentItems(services)
  return (
    <ContentGrid
      items={items}
      isLoading={false}
      hasNextPage={false}
      onLoadMore={undefined}
      compact={true}
      notFoundTitle={t('text-services-not-found')}
      notFoundMessage={t('text-services-not-found-message')}
    />
  )
}

interface ServicesPageProps {
  services: Service[]
  title: string
  description: string
  markdownContent: string
}

const ServicesPage: NextPageWithLayout<ServicesPageProps> = ({
  services,
  title,
  description,
  markdownContent
}) => {
  const { t } = useTranslation('common')
  return (
    <>
      <Seo
        title={title}
        description={description}
        url={routes.services}
        canonical={routes.services}
      />
      <div className="px-4 pt-5 md:px-6 md:pt-6 lg:px-7 3xl:px-8">
        <h1 className="mb-5 text-lg font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h1>
      </div>
      <Grid services={services} />
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

ServicesPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default ServicesPage
