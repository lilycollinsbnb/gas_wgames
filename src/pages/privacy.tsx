import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import type { NextPageWithLayout } from '@/types'
import GeneralLayout from '@/layouts/_general-layout'
import PageHeading from '@/components/ui/page-heading'
import GeneralContainer from '@/layouts/_general-container'
import Seo from '@/layouts/_seo'
import routes from '@/config/routes'
import MarkdownRenderer from '@/components/ui/markdown-renderer'
import path from 'path'
import fs from 'fs'

interface PrivacyPageProps {
  markdownContent: string
}

const PrivacyPage: NextPageWithLayout<PrivacyPageProps> = ({
  markdownContent
}) => {
  const { t } = useTranslation('common')
  return (
    <>
      <Seo
        title="Privacy Policy"
        description="2D and 3D assets for your Godot projects."
        url={routes.privacy}
        canonical={routes.privacy}
      />
      <div className="mx-auto flex h-full w-full max-w-screen-xl flex-col p-4 sm:p-5">
        <PageHeading
          title={t('text-privacy-page-title')}
          subtitle={t('text-privacy-page-subtitle')}
        />
        <GeneralContainer>
          <MarkdownRenderer content={markdownContent} />
        </GeneralContainer>
      </div>
    </>
  )
}

PrivacyPage.getLayout = function getLayout(page) {
  return <GeneralLayout>{page}</GeneralLayout>
}

export const getStaticProps: GetStaticProps<PrivacyPageProps> = async ({
  locale
}) => {
  const filePath = path.join(
    process.cwd(),
    `src/data/static/markdown/${locale}/License.md`
  )
  const markdownContent = fs.readFileSync(filePath, 'utf8')
  return {
    props: {
      markdownContent: markdownContent,
      ...(await serverSideTranslations(locale!, ['common']))
    }
  }
}

export default PrivacyPage
