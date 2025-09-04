import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import type { NextPageWithLayout } from '@/types'
import DashboardLayout from '@/layouts/_dashboard'
import { useState } from 'react'
import Input from '@/components/ui/forms/input'
import Button from '@/components/ui/button'
import { useRedeemBetaAccess } from '@/data/games'

const ActivateProductPage: NextPageWithLayout = () => {
  const { t } = useTranslation('common')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { redeem } = useRedeemBetaAccess()
  const handleFetch = async () => {
    if (!code) {
      setError(t('text-access-code-required'))
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      await redeem(code)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-full flex-grow flex-col">
      <h1 className="mb-5 text-15px font-medium text-dark dark:text-light sm:mb-6">
        {t('text-activate-product')}
      </h1>
      <div className="space-y-4">
        <Input
          label={t('text-access-code')}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          error={error || undefined}
          placeholder={t('access-code-input-placeholder')}
        />
        <Button
          onClick={handleFetch}
          isLoading={isLoading}
          disabled={isLoading}
          className="w-full"
        >
          {t('text-activate')}
        </Button>
      </div>
    </div>
  )
}

ActivateProductPage.authorization = true
ActivateProductPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common']))
    },
    revalidate: 15 * 60 // In seconds
  }
}

export default ActivateProductPage
