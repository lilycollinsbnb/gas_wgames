import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { BreadcrumbItem, NextPageWithLayout, Training } from '@/types'
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType
} from 'next'
import Layout from '@/layouts/_layout'
import placeholder from '@/assets/images/placeholders/product.svg'
import Seo from '@/layouts/_seo'
import MarkdownRenderer from '@/components/ui/markdown-renderer'
import routes from '@/config/routes'
import ImageWithFallback from '@/components/ui/image-with-fallback'
import ContentGrid from '@/components/content/content-grid'
import { useTranslation } from 'next-i18next'
import StaticBreadcrumbs from '@/components/ui/links/static-breadcrumbs'
import client from '@/data/client'

type ParsedQueryParams = {
  trainingPath?: string[]
}

type PageProps = {
  training: Training
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const paths: { params: { trainingPath: string[] }; locale: string }[] = []

  for (const locale of locales || []) {
    const trainingPaginator = await client.trainings.all({
      limit: 100,
      language: locale
    })
    const trainings = trainingPaginator.data
    trainings.forEach((training) => {
      paths.push({
        params: { trainingPath: training.url.replace(/^\/+/, '').split('/') },
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
    const segments = params?.trainingPath || []
    const slug = segments[segments.length - 1]
    const training = await client.trainings.get({
      slug: slug,
      language: locale
    })
    return {
      props: {
        training,
        ...(await serverSideTranslations(locale!, ['common']))
      },
      revalidate: 30 * 60
    }
  } catch (error) {
    console.error('Error fetching training:', error)
    return {
      notFound: true,
      revalidate: 30 * 60
    }
  }
}

const TrainingPage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ training }) => {
  const { t } = useTranslation('common')
  const fullBreadcrumbs: BreadcrumbItem[] = [
    {
      label: t('text-services'),
      href: routes.services
    },
    {
      label: t('text-trainings'),
      href: routes.trainings
    },
    ...training.breadcrumbs.map((item) => {
      return { label: item.label, href: routes.training(item.href) }
    })
  ]
  return (
    <>
      <Seo
        title={`${training.title}`}
        description={training.description}
        url={routes.training(training.url)}
        canonical={routes.training(training.url)}
      />
      <div className="w-full px-4 pt-5 md:px-6 md:pt-6 lg:px-7 3xl:px-8">
        <h1 className="text-lg mb-5 font-bold text-gray-900 dark:text-gray-100">
          {training.title}
        </h1>
        <StaticBreadcrumbs items={fullBreadcrumbs} />
      </div>
      {training.children && training.children.length > 0 && (
        <ChildrenList trainings={training.children} />
      )}
      <div className="w-full mt-5 px-4 pb-9 md:px-6 md:pb-10 lg:px-7 lg:pb-12 3xl:px-8">
        <MarkdownRenderer
          allowHtml={true}
          sanitizeHtml={true}
          enableMarkdownPreprocessing={true}
          content={training.content ?? ''}
        />
      </div>
    </>
  )
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

const ChildrenList = ({ trainings }: { trainings: Training[] }) => {
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

const TrainingImage = ({ training }: { training: Training }) => {
  return (
    <div className="relative mb-5 aspect-[16/9]">
      <ImageWithFallback
        src={training?.image ?? placeholder}
        alt={training?.title || 'training image'}
        quality={100}
        fill
        objectFit="cover"
        className="rounded-lg shadow-lg"
      />
    </div>
  )
}

TrainingPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default TrainingPage
