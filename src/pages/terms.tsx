import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import type { NextPageWithLayout } from '@/types'
import GeneralLayout from '@/layouts/_general-layout'
import PageHeading from '@/components/ui/page-heading'
import GeneralContainer from '@/layouts/_general-container'
import { termsData } from '@/data/static/terms-setting'
import Seo from '@/layouts/_seo'
import routes from '@/config/routes'
import path from 'path'
import fs from 'fs'
import MarkdownRenderer from '@/components/ui/markdown-renderer'

interface TermsPageProps {
  markdownContent: string
}

const TermsPage: NextPageWithLayout<TermsPageProps> = ({ markdownContent }) => {
  const { t } = useTranslation('common')
  return (
    <>
      <Seo
        title="Terms and Conditions - User Agreements and Policies"
        description="Review the terms and conditions for using the Assets 4 Godot Store. Learn about user agreements, asset licensing, refunds, and privacy policies. Stay informed of your rights and responsibilities."
        url={routes.terms}
        canonical={routes.terms}
      />
      <div className="mx-auto flex h-full w-full max-w-screen-xl flex-col p-4 sm:p-5">
        <PageHeading
          title={t('text-terms-page-title')}
          subtitle={t('text-terms-page-subtitle')}
        />
        <GeneralContainer>
          <MarkdownRenderer content={markdownContent} />
        </GeneralContainer>
      </div>
    </>
  )
}

TermsPage.getLayout = function getLayout(page) {
  return <GeneralLayout>{page}</GeneralLayout>
}

export const getStaticProps: GetStaticProps<TermsPageProps> = async ({
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

export default TermsPage
