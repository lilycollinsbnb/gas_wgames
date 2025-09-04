import { useMutation } from 'react-query'
import toast from 'react-hot-toast'
import { useTranslation } from 'next-i18next'
import client from '@/data/client'
import useAuth from '@/components/auth/use-auth'

export default function useLoginMutation() {
  const { t } = useTranslation('common')
  const { authorize } = useAuth()

  return useMutation(client.users.login, {
    onSuccess: (data) => {
      authorize(data.token, data.permissions)
    },
    onError: (error: any) => {
      const messageKey = error?.response?.data?.message

      const translatedMessage =
        messageKey && typeof messageKey === 'string'
          ? t(messageKey)
          : t('error-wrong-credentials')

      toast.error(<b>{translatedMessage}</b>, {
        className: '-mt-10 xs:mt-0'
      })
    }
  })
}
