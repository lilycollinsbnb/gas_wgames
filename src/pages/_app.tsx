import type { AppProps } from 'next/app'
import type { NextPageWithLayout } from '@/types'
import { useEffect, useState } from 'react'
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from 'next-themes'
import { appWithTranslation } from 'next-i18next'
import { validateEnvironmentVariables } from '@/config/validate-environment-variables'
import { CartProvider } from '@/components/cart/lib/cart.context'
import { ModalProvider } from '@/components/modal-views/context'
import ModalsContainer from '@/components/modal-views/container'
import DrawersContainer from '@/components/drawer-views/container'
import SearchView from '@/components/search/search-view'
import DefaultSeo from '@/layouts/_default-seo'
import { SearchProvider } from '@/components/search/search.context'

// fonts
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter'
})

import localFont from 'next/font/local'

const adlib = localFont({
  src: '../../public/fonts/adlib.woff2',
  variable: '--font-adlib'
})

// base css file
import '@/assets/css/scrollbar.css'
import '@/assets/css/swiper-carousel.css'
import '@/assets/css/pagination.css'
import '@/assets/css/globals.css'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { getDirection } from '@/lib/constants'
import useCookieConsent from '@/components/cookies/hooks/use-cookie-consent'
import GoogleAnalytics from '@/components/cookies/google-analytics'
import useImageErrorHandler from '@/lib/hooks/use-image-error-handler'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'
// import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

const PrivateRoute = dynamic(() => import('@/layouts/_private-route'), {
  ssr: false
})

validateEnvironmentVariables()

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function CustomApp({ Component, pageProps }: AppPropsWithLayout) {
  const { asPath, locale } = useRouter()
  const [queryClient] = useState(() => new QueryClient())

  const { cookiesAccepted } = useCookieConsent()
  const getLayout = Component.getLayout ?? ((page) => page)
  const dir = getDirection(locale)
  useEffect(() => {
    document.documentElement.dir = dir
  }, [dir])
  useImageErrorHandler()
  const authenticationRequired = Component.authorization ?? false
  // const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!

  return (
    <main className={`${inter.variable} ${adlib.variable} font-body`}>
      <SpeedInsights />
      <Analytics />
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
          >
            <SearchProvider>
              <CartProvider>
                {/* <GoogleReCaptchaProvider
                  reCaptchaKey={recaptchaKey}
                  scriptProps={{ async: true, defer: true, appendTo: 'head' }}
                > */}
                <ModalProvider>
                  <AnimatePresence
                    initial={false}
                    onExitComplete={() => window.scrollTo(0, 0)}
                  >
                    <motion.div key={`app-motion-div`}>
                      <DefaultSeo />
                      {authenticationRequired ? (
                        <PrivateRoute>
                          {getLayout(<Component {...pageProps} />)}
                        </PrivateRoute>
                      ) : (
                        getLayout(<Component {...pageProps} />)
                      )}
                      <SearchView />
                      <ModalsContainer />
                      <DrawersContainer />
                      <Toaster containerClassName="!top-16 sm:!top-3.5 !bottom-16 sm:!bottom-3.5" />
                    </motion.div>
                  </AnimatePresence>
                </ModalProvider>
                {/* </GoogleReCaptchaProvider> */}
              </CartProvider>
            </SearchProvider>
          </ThemeProvider>
        </Hydrate>
        {cookiesAccepted && <GoogleAnalytics />}
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </main>
  )
}

export default appWithTranslation(CustomApp)
