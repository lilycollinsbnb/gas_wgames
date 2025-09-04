import { useMutation } from 'react-query'
import client from '@/data/client'
import { OAuthProviderEnum } from '@/types'
import { useRouter } from 'next/router'
import routes from '@/config/routes'
import useAuth from '@/components/auth/use-auth'
import toast from 'react-hot-toast'

interface OAuthLoginParams {
  code: string
  provider: OAuthProviderEnum
}

export function useOAuthLoginMutation() {
  const { authorize } = useAuth()
  const router = useRouter()

  return useMutation(
    ({ code, provider }: OAuthLoginParams) =>
      client.users.oAuthLogin({ authentication_code: code, provider }),
    {
      onSuccess: (data) => {
        if (data.token) {
          authorize(data.token, data.permissions)
          router.push(routes.home)
        }
      },
      onError: (err) => {
        console.error('OAuth login failed:', err)
        // No UI state here — delegate that to the caller
      }
    }
  )
}
