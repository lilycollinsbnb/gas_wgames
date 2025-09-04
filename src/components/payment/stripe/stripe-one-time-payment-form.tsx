'use client'

import React from 'react'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import client from '@/data/client'
import Button from '@/components/ui/button'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { useEffect, useRef, useState } from 'react'
import { useModalAction } from '@/components/modal-views/context'

interface StripeOneTimePaymentFormProps {
  orderId: string
  refreshPage: Function | undefined
}

const StripeOneTimePaymentForm: React.FC<StripeOneTimePaymentFormProps> = ({
  orderId,
  refreshPage
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const { t } = useTranslation('common')
  const { closeModal } = useModalAction()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (!stripe || !elements) return

      setLoading(true)
      const { error } = await stripe?.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}`
        },
        redirect: 'if_required'
      })

      if (error) {
        return
      }
      await client.orders.notifyPaymentSucceeded({ order_id: orderId })
      // TODO make it only change order status so page doesn't need to fully reload
      // if(refreshPage){
      //     refreshPage()
      // }
      closeModal()
      router.reload()
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <form id="payment-form" onSubmit={onSubmit}>
      <div className="mt-12">
        <div>
          <PaymentElement
            id="payment-element"
            options={{ layout: 'accordion' }}
          />
          <Button
            disabled={loading || !stripe || !elements}
            className="mb-3 mt-3 w-full"
            type="submit"
          >
            {t('text-pay')}
          </Button>
        </div>
      </div>
    </form>
  )
}

export default StripeOneTimePaymentForm
