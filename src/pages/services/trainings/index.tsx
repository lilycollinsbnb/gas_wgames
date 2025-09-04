import type { GetStaticProps } from 'next'
import type { BreadcrumbItem, NextPageWithLayout, Training } from '@/types'
import Layout from '@/layouts/_layout'
import Seo from '@/layouts/_seo'
import routes from '@/config/routes'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import ContentGrid from '@/components/content/content-grid'
import { useTranslation } from 'next-i18next'
import StaticBreadcrumbs from '@/components/ui/links/static-breadcrumbs'
import client from '@/data/client'
import MarkdownRenderer from '@/components/ui/markdown-renderer'

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const trainings = await client.trainings.topLevel(locale)
    const trainingPageContent = await client.services.get({
      slug: 'trainings',
      language: locale
    })

    return {
      props: {
        trainings: trainings,
        title: trainingPageContent.title || 'Trainings',
        description: trainingPageContent.description || '',
        markdownContent: trainingPageContent.content || '',
        ...(await serverSideTranslations(locale!, ['common']))
      },
      revalidate: 30 * 60 // 30 minutes
    }
  } catch (error) {
    console.error('Error in getStaticProps:', error)

    return {
      props: {
        trainings: [],
        title: 'Trainings',
        description: '',
        markdownContent: '',
        ...(await serverSideTranslations(locale!, ['common']))
      },
      revalidate: 30 * 60 // 30 minutes
    }
  }
}

function mapTrainingsToContentItems(
  trainings: Training[],
  translationFunction: any
) {
  return trainings.map((training) => ({
    id: training.url,
    title: training.title,
    image: training.image?.original,
    description: training.description,
    redirectLink: routes.training(training.url),
    footer: (
      <span className="text-sm font-medium text-brand">
        {training?.level
          ? `${translationFunction('text-level')}: ${training.level}`
          : ''}
      </span>
    )
  }))
}

function Grid({ trainings }: { trainings: Training[] }) {
  const { t } = useTranslation('common')
  const items = mapTrainingsToContentItems(trainings, t)
  return (
    <ContentGrid
      items={items}
      isLoading={false}
      hasNextPage={false}
      onLoadMore={undefined}
      compact={true}
      notFoundTitle={t('text-trainings-not-found')}
      notFoundMessage={t('text-trainings-not-found-message')}
    />
  )
}

interface TrainingPageProps {
  trainings: Training[]
  title: string
  description: string
  markdownContent: string
}

const TrainingsPage: NextPageWithLayout<TrainingPageProps> = ({
  trainings,
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
      label: t('text-trainings'),
      href: routes.trainings
    }
  ]
  return (
    <>
      <Seo
        title={title}
        description={description}
        url={routes.trainings}
        canonical={routes.trainings}
      />
      <div className="px-4 pt-5 md:px-6 md:pt-6 lg:px-7 3xl:px-8">
        <h1 className="mb-5 text-lg font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h1>
        <StaticBreadcrumbs items={breadcrumbs} />
      </div>
      <Grid trainings={trainings} />
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

TrainingsPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default TrainingsPage
