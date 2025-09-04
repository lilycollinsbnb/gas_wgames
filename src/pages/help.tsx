import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import type { NextPageWithLayout } from '@/types'
import GeneralLayout from '@/layouts/_general-layout'
import PageHeading from '@/components/ui/page-heading'
import GeneralContainer from '@/layouts/_general-container'
import Accordion from '@/components/ui/accordion'
import Seo from '@/layouts/_seo'
import { helpData } from '@/data/static/help-setting'
import routes from '@/config/routes'

const HelpPage: NextPageWithLayout = () => {
  const { t } = useTranslation('common')
  return (
    <>
      <Seo
        title="Help"
        description="Find answers to your questions about our Godot Assets. Learn how to download and use assets. Step-by-step guides and FAQs to help you get started."
        url={routes.help}
        canonical={routes.help}
      />
      <div className="mx-auto flex h-full w-full max-w-screen-xl flex-col p-4 sm:p-5">
        <PageHeading
          title={t('text-help-page-title')}
          subtitle={t('text-help-page-subtitle')}
        />
        <GeneralContainer>
          {helpData?.map((item) => (
            <Accordion key={`${item.title}-${item.id}`} item={item} />
          ))}
        </GeneralContainer>
      </div>
    </>
  )
}

HelpPage.getLayout = function getLayout(page) {
  return <GeneralLayout>{page}</GeneralLayout>
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common']))
    },
    revalidate: 15 * 60 // In seconds
  }
}

export default HelpPage
