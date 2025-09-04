import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import Button from '@/components/ui/button'
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom'
import { NextPageWithLayout, OAuthProviderEnum } from '@/types'
import Layout from '@/layouts/_layout'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'
import { useOAuthLoginMutation } from '@/components/auth/lib/use-ouath-login'

interface QueryParams {
  code?: string
  error?: string
  error_description?: string
}

const CallbackPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { code, error, error_description } = router.query as QueryParams
  const [message, setMessage] = useState<string>('text-authentication')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { t } = useTranslation()

  const { mutate: loginOAuth } = useOAuthLoginMutation()

  useEffect(() => {
    if (error) {
      setMessage(error_description || `An error occurred: ${error}`)
      setIsLoading(false)
    } else if (code) {
      setIsLoading(true)
      loginOAuth(
        { code, provider: OAuthProviderEnum.DISCORD },
        {
          onError: (err: any) => {
            setMessage(
              err.message || 'An error occurred during authentication.'
            )
            setIsLoading(false)
          }
        }
      )
    }
  }, [code, error, error_description, loginOAuth])

  return (
    <motion.div
      variants={fadeInBottom()}
      className="flex min-h-screen flex-col items-center justify-center"
    >
      <h1 className="mb-4 text-2xl font-bold">{t('text-authentication')}</h1>

      {isLoading ? (
        <p>{t('text-authenticating')}</p>
      ) : (
        <div>
          <p className={error ? 'text-red-500' : 'text-green-500'}>
            {t(message)}
          </p>
          {error && (
            <Button onClick={() => router.push('/')} className="mt-4">
              {t('text-go-home')}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  )
}

CallbackPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common']))
    }
  }
}

export default CallbackPage
