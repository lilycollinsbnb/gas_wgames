import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import Button from '@/components/ui/button'
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom'
import { useConfirmEmail } from '@/data/user'
import { NextPageWithLayout } from '@/types'
import Layout from '@/layouts/_layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useModalAction } from '@/components/modal-views/context'
import { useTranslation } from 'react-i18next'

const ConfirmEmailPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { userId, token } = router.query
  const { confirmEmail, isLoading, isError, data } = useConfirmEmail()
  const { openModal } = useModalAction()
  const { t } = useTranslation()

  const [message, setMessage] = useState<string>('Processing...')
  const [invalidParams, setInvalidParams] = useState(false)

  useEffect(() => {
    if (userId && token) {
      confirmEmail({ userId: userId as string, token: token as string })
    } else if (router.isReady) {
      // Only mark invalid if router is fully ready
      setInvalidParams(true)
      setMessage('The confirmation link is invalid or expired.')
    }
  }, [userId, token, confirmEmail, router.isReady])

  useEffect(() => {
    if (isError) {
      setMessage('The confirmation link is invalid or expired.')
    } else if (data?.message) {
      setMessage(data.message)
    } else if (data?.success) {
      setMessage('Email confirmed successfully!')
    }
  }, [isError, data])

  return (
    <motion.div
      variants={fadeInBottom()}
      className="flex min-h-screen flex-col items-center justify-center px-4 text-center"
    >
      <h1 className="mb-4 text-2xl font-bold">Email Confirmation</h1>

      {isLoading ? (
        <p className="text-gray-500">{t('Processing...')}</p>
      ) : (
        <div className="flex flex-col items-center max-w-xl">
          <p
            className={`mb-4 ${data?.success ? 'text-green-500' : 'text-red-500'}`}
          >
            {t(message)}
          </p>

          {data?.success && !invalidParams && (
            <Button
              onClick={async () => {
                await router.push('/')
                openModal('LOGIN_VIEW')
              }}
              className="mt-4"
            >
              {t('text-get-login')}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  )
}

ConfirmEmailPage.getLayout = (page) => <Layout>{page}</Layout>

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common']))
    }
  }
}

export default ConfirmEmailPage
