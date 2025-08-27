import { useRouter } from 'next/router'
import { useMutation } from 'react-query'
import { useAtom } from 'jotai'
import toast from 'react-hot-toast'
import client from '@/data/client'
import usePrice from '@/lib/hooks/use-price'
import Button from '@/components/ui/button'
import { useCart } from '@/components/cart/lib/cart.context'
import {
  payableAmountAtom,
  useWalletPointsAtom,
  verifiedTokenAtom,
  checkoutAtom
} from '@/components/cart/lib/checkout'
import PaymentGrid from '@/components/cart/payment/payment-grid'
import routes from '@/config/routes'
import { useTranslation } from 'next-i18next'
import { CreateOrderClientDataInput, PaymentGateway } from '@/types'
import { useSettings } from '@/data/settings'
import { SubmitHandler, UseFormHandleSubmit } from 'react-hook-form'

interface CartCheckoutProps {
  submitClientData: UseFormHandleSubmit<CreateOrderClientDataInput>
}

export default function CartCheckout({ submitClientData }: CartCheckoutProps) {
  const router = useRouter()
  const { t } = useTranslation('common')

  const { mutate, isLoading } = useMutation(client.orders.create, {
    onSuccess: (res) => {
      const { id, payment_gateway } = res
      if (id) {
        return router.push(`${routes.orderUrl(id)}/payment`)
      }
    },

    onError: (err: any) => {
      toast.error(<b>{t('text-profile-page-error-toast')}</b>)
      console.log(err.response.data.message)
    }
  })

  const [{ payment_gateway }] = useAtom(checkoutAtom)
  const [token] = useAtom(verifiedTokenAtom)
  const { items, verifiedResponse } = useCart()

  const available_items = items.filter(
    (item) =>
      !verifiedResponse?.unavailable_products?.includes(item.id.toString())
  )

  // Calculate price
  const { price: tax } = usePrice(
    verifiedResponse && {
      amount: verifiedResponse.total_tax ?? 0
    }
  )

  const base_amount = verifiedResponse?.subtotal ?? 0

  const { price: sub_total } = usePrice({
    amount: base_amount
  })

  const totalPrice = verifiedResponse
    ? base_amount + verifiedResponse.total_tax
    : 0

  const { price: total } = usePrice(
    verifiedResponse && {
      amount: totalPrice
    }
  )

  function createOrder() {
    if (!Boolean(verifiedResponse) || !verifiedResponse?.can_place_order) {
      return
    }

    submitClientData((data: CreateOrderClientDataInput) => {
      const gateway =
        totalPrice === 0 ? PaymentGateway.NO_PAYMENT_REQUIRED : payment_gateway

      mutate({
        amount: base_amount,
        total: totalPrice,
        paid_total: totalPrice,
        products: available_items.map((item) => ({
          product_id: item.id,
          order_quantity: item.quantity,
          unit_price: item.price,
          subtotal: item.price * item.quantity,
          item_type: item.item_type
        })),
        payment_gateway: gateway,
        ...(token && { token }),
        sales_tax: verifiedResponse?.total_tax ?? 0,
        customer_data: data
      })
    })()
  }

  return (
    <div className="mt-10 border-t border-light-400 bg-light pb-7 pt-6 dark:border-dark-400 dark:bg-dark-250 sm:bottom-0 sm:mt-12 sm:pb-9 sm:pt-8">
      <div className="mb-6 flex flex-col gap-3 text-dark dark:text-light sm:mb-7">
        <div className="flex justify-between">
          <p>{t('text-subtotal')}</p>
          <strong className="font-semibold">{sub_total}</strong>
        </div>
        <div className="flex justify-between">
          <p>
            {t('text-tax')}{' '}
            {verifiedResponse?.tax_percentage
              ? `(${verifiedResponse?.tax_percentage} %)`
              : ''}
          </p>
          <strong className="font-semibold">{tax}</strong>
        </div>
        <div className="mt-4 flex justify-between border-t border-light-400 pt-5 dark:border-dark-400">
          <p>{t('text-total')}</p>
          <strong className="font-semibold">{total}</strong>
        </div>
      </div>

      {totalPrice === 0 ? null : <PaymentGrid />}

      <Button
        id="place-order-button"
        disabled={
          isLoading ||
          !Boolean(verifiedResponse) ||
          !verifiedResponse?.can_place_order
        }
        isLoading={isLoading}
        onClick={createOrder}
        className="w-full md:h-[50px] md:text-sm"
      >
        {t('text-submit-order')}
      </Button>
    </div>
  )
}
