import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dayjs from 'dayjs'
import { GetServerSideProps } from 'next'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import ReactConfetti from 'react-confetti'
import type { NextPageWithLayout } from '@/types'
import GeneralLayout from '@/layouts/_general-layout'
import { useWindowSize } from '@/lib/hooks/use-window-size'
import { useCart } from '@/components/cart/lib/cart.context'
import { useTranslation } from 'next-i18next'
import { dehydrate, QueryClient } from 'react-query'
import { API_ENDPOINTS } from '@/data/client/endpoints'
import client from '@/data/client'
import type { SettingsQueryOptions } from '@/types'
import usePrice from '@/lib/hooks/use-price'
import OrderViewHeader from '@/components/orders/order-view-header'
import OrderStatusProgressBox from '@/components/orders/order-status-progress-box'
import { OrderStatus, PaymentGateway, PaymentStatus } from '@/types'
import { OrderItems } from '@/components/orders/order-items'
import { useGetPaymentIntent, useOrder } from '@/data/order'
import { useModalAction } from '@/components/modal-views/context'
import { PageLoader } from '@/components/ui/loader/spinner/spinner'
import { Order } from '@/types'
import ErrorMessage from '@/components/ui/error-message'
import { getOrderPaymentSummery } from '@/lib/get-order-payment-summery'
import { loadStripe, PaymentIntent } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import dynamic from 'next/dynamic'
import Button from '@/components/ui/button'
const StripeOneTimePaymentForm = dynamic(
  () => import('@/components/payment/stripe/stripe-one-time-payment-form'),
  { ssr: false }
)

type Props = {
  title: string
  details: string | undefined
}

const Card = ({ title, details }: Props) => {
  return (
    <div className="flex min-h-[6.5rem] items-center rounded border border-gray-200 px-6 py-4 dark:border-[#434343] dark:bg-dark-200">
      <div>
        <h3 className="mb-2 text-xs font-normal dark:text-white/60">
          {title} :{' '}
        </h3>
        <p className="text-dark-200 dark:text-white">{details}</p>
      </div>
    </div>
  )
}

const Listitem = ({ title, details }: Props) => {
  return (
    <p className="text-body-dark mt-5 flex items-center text-xs">
      <strong className="w-5/12 sm:w-4/12">{title}</strong>
      <span>:</span>
      <span className="w-7/12 ltr:pl-4 rtl:pr-4 dark:text-white sm:w-8/12 ">
        {details}
      </span>
    </p>
  )
}
interface OrderViewProps {
  order: Order | undefined
  paymentIntent: PaymentIntent | undefined
  orderRefetch: Function | undefined
  loadingStatus?: boolean
}
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''
)
const OrderView = ({
  order,
  paymentIntent,
  loadingStatus,
  orderRefetch
}: OrderViewProps) => {
  const { t } = useTranslation('common')
  const { width, height } = useWindowSize()
  const { resetCart } = useCart()

  useEffect(() => {
    resetCart()
  }, [])

  const { price: total } = usePrice({ amount: order?.total! })
  const { price: sub_total } = usePrice({ amount: order?.amount! })
  const { price: tax } = usePrice({ amount: order?.sales_tax ?? 0 })

  return (
    <div className="p-4 sm:p-8">
      <div className="mx-auto w-full max-w-screen-lg">
        <div className="relative overflow-hidden rounded">
          <OrderViewHeader
            order={order}
            buttonSize="small"
            loading={loadingStatus}
          />
          <div className="bg-light px-6 pb-12 pt-9 dark:bg-dark-200 lg:px-8">
            <div className="mb-6 grid gap-4 sm:grid-cols-2 md:mb-12 lg:grid-cols-4">
              <Card title={t('text-order-number')} details={order?.id} />
              <Card
                title={t('text-date')}
                details={dayjs(order?.created_at).format('DD.MM.YYYY')}
              />
              <Card title={t('text-total')} details={total} />
              <Card
                title={t('text-payment-method')}
                details={
                  order?.payment_gateway === PaymentGateway.NO_PAYMENT_REQUIRED
                    ? t('text-no-payment-required')
                    : order?.payment_gateway
                }
              />
            </div>

            <div className="mt-12 flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 ltr:md:pl-3 rtl:md:pr-3">
                <h2 className="mb-6 text-base font-medium dark:text-white">
                  {t('text-order-status')}
                </h2>
                <div>
                  <OrderStatusProgressBox
                    orderStatus={order?.order_status as OrderStatus}
                    paymentStatus={order?.payment_status as PaymentStatus}
                  />
                </div>
              </div>
              {/* end of order details */}

              <div className="mb-10 w-full md:mb-0 md:w-1/2 ltr:md:pr-3 rtl:md:pl-3">
                <h2 className="mb-6 text-base font-medium dark:text-white">
                  {t('text-order-details')}
                </h2>
                <div>
                  <Listitem title={t('text-subtotal')} details={sub_total} />
                  <Listitem
                    title={`VAT ${
                      order?.tax_info?.percentage
                        ? `(${order?.tax_info?.percentage} %)`
                        : ''
                    }`}
                    details={tax}
                  />
                  <div className="w-1/2 border-b border-solid border-gray-200 py-1 dark:border-b-[#434343]" />
                  <Listitem title={t('text-total')} details={total} />
                </div>
              </div>
              {/* end of total amount */}
            </div>
            <div className="mt-12">
              <OrderItems
                products={order?.products}
                orderId={order?.id}
                status={order?.payment_status as PaymentStatus}
              />
            </div>

            {paymentIntent?.client_secret &&
              order?.payment_status === 'payment_pending' && (
                <div className="modal-content-container">
                  <Elements
                    stripe={stripePromise}
                    options={{ clientSecret: paymentIntent?.client_secret! }}
                  >
                    <StripeOneTimePaymentForm
                      orderId={order?.id!}
                      refreshPage={orderRefetch}
                    />
                  </Elements>
                </div>
              )}
          </div>
        </div>
      </div>

      {order && order.payment_status === PaymentStatus.SUCCESS ? (
        <ReactConfetti
          width={width - 10}
          height={height}
          recycle={false}
          tweenDuration={8000}
          numberOfPieces={300}
        />
      ) : (
        ''
      )}
    </div>
  )
}

const OrderPage: NextPageWithLayout = () => {
  const { query } = useRouter()
  const orderId = query.id?.toString()
  const {
    order,
    isLoading: isOrderLoading,
    error: orderError,
    isFetching,
    refetch
  } = useOrder({ id: orderId ?? '' })

  const shouldLoadPaymentIntent =
    !!orderId &&
    !!order &&
    !!order?.payment_gateway &&
    order?.payment_gateway !== PaymentGateway.NO_PAYMENT_REQUIRED

  const {
    paymentIntent,
    isLoading: isPaymentIntentLoading,
    error: paymentIntentError
  } = useGetPaymentIntent(
    { order_id: orderId ?? '' },
    {
      enabled: shouldLoadPaymentIntent
    }
  )

  const isLoading = isOrderLoading || isPaymentIntentLoading
  const error = orderError || paymentIntentError
  const errorMessage = `${orderError ?? ''} ${paymentIntentError ?? ''}`.trim()

  if (isLoading) {
    return <PageLoader showText={false} />
  }

  if (error) return <ErrorMessage message={errorMessage} />
  return (
    <OrderView
      order={order}
      paymentIntent={
        order?.payment_gateway === PaymentGateway.NO_PAYMENT_REQUIRED
          ? undefined
          : paymentIntent
      }
      orderRefetch={refetch}
      loadingStatus={!isLoading && isFetching}
    />
  )
}

OrderPage.authorization = true
OrderPage.getLayout = function getLayout(page: any) {
  return <GeneralLayout>{page}</GeneralLayout>
}

export default OrderPage

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery(
    [API_ENDPOINTS.SETTINGS, { language: locale }],
    ({ queryKey }) => client.settings.all(queryKey[1] as SettingsQueryOptions)
  )

  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common'])),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient)))
    }
  }
}
