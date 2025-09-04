import {
  PaymentGateway,
  type CreateOrderClientDataInput,
  type NextPageWithLayout
} from '@/types'
import { useRouter } from 'next/router'
import routes from '@/config/routes'
import GeneralLayout from '@/layouts/_general-layout'
import CartItemList from '@/components/cart/cart-item-list'
import CartEmpty from '@/components/cart/cart-empty'
import Button from '@/components/ui/button'
import { ReactPhone } from '@/components/ui/forms/phone-input'
import { useCart } from '@/components/cart/lib/cart.context'
import { LongLeftArrowIcon } from '@/components/icons/long-arrow-left-icon'
import client from '@/data/client'
import { useMutation } from 'react-query'
import { useMe } from '@/data/user'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetStaticProps } from 'next'
import Input from '@/components/ui/forms/input'
import { Form } from '@/components/ui/forms/form'
import { Controller, SubmitHandler } from 'react-hook-form'
import * as yup from 'yup'
import { useEffect, useState } from 'react'
import CheckBox from '@/components/ui/forms/checkbox'
import Select from '@/components/ui/forms/select'
import countries from '@/data/static/countries'
import toast from 'react-hot-toast'
import PaymentGrid from '@/components/cart/payment/payment-grid'
import { useAtom } from 'jotai'
import { checkoutAtom, verifiedTokenAtom } from '@/components/cart/lib/checkout'
import usePrice from '@/lib/hooks/use-price'
import { Trans } from 'next-i18next'
import Link from 'next/link'

const CheckoutPage: NextPageWithLayout = () => {
  const [verifiedStatus, setVerifiedStatus] = useState(false)
  const [isCompanyInvoice, setIsCompanyInvoice] = useState(false)
  const { t } = useTranslation('common')

  const termsLabel = (
    <Trans i18nKey="accept-terms-label">
      I confirm that I have read and accept the
      <Link href="/terms" className="text-body underline">
        Terms and Conditions
      </Link>
      and the
      <Link href="/privacy" className="text-body underline">
        Privacy Policy
      </Link>
      .
    </Trans>
  )

  const clientDataValidationSchema = yup.object().shape({
    id: yup.string().required(),
    fullname: yup.string().required(t('fullname-is-required-error')),
    email: yup
      .string()
      .email(t('email-is-required-error'))
      .required(t('email-is-required-error')),
    phone_number: yup
      .string()
      .min(6, t('phone-number-to-short-error'))
      .required(t('phone-number-is-required-error')),
    is_company_invoice: yup.boolean().required(),
    country: yup.string().required(t('country-is-required-error')),
    city: yup.string().required(t('city-is-required-error')),
    address: yup.string().required(t('address-is-required-error')),
    post_code: yup.string().required(t('post-code-is-required-error')),
    company_name: yup
      .string()
      .when('is_company_invoice', ([is_company_invoice], schema) =>
        is_company_invoice
          ? schema.required(t('company-name-is-required-error'))
          : schema
      ),
    tax_identification_number: yup
      .string()
      .when('is_company_invoice', ([is_company_invoice], schema) =>
        is_company_invoice
          ? schema.required(t('tax-identification-number-is-required-error'))
          : schema
      ),
    accepted_terms_and_conditions: yup
      .boolean()
      .oneOf([true], t('text-accept-terms-error'))
  })

  const router = useRouter()
  const { me } = useMe()

  const {
    items,
    total,
    totalItems,
    isEmpty,
    setVerifiedResponse,
    verifiedResponse
  } = useCart()

  const language = router.locale
  const { mutate, isLoading: isVeryfingOrder } = useMutation(
    client.orders.verify,
    {
      onSuccess: (res) => {
        setVerifiedResponse(res)
      }
    }
  )

  function verify() {
    mutate({
      amount: total,
      products: items.map((item) => ({
        product_id: item.id,
        order_quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity,
        item_type: item.item_type
      }))
    })
    setVerifiedStatus(true)
  }

  useEffect(() => {
    setVerifiedStatus(false)
  }, [totalItems])

  if (!verifiedStatus) {
    verify()
  }

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    router.push(routes.home)
  }

  const [{ payment_gateway }] = useAtom(checkoutAtom)
  const [token] = useAtom(verifiedTokenAtom)

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

  const { price: verifiedResponseTotal } = usePrice(
    verifiedResponse && {
      amount: totalPrice
    }
  )

  const { mutate: mutateOrder, isLoading: isCreatingOrder } = useMutation(
    client.orders.create,
    {
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
    }
  )

  function createOrder(data: CreateOrderClientDataInput) {
    if (isCreatingOrder || isVeryfingOrder) return
    if (!Boolean(verifiedResponse) || !verifiedResponse?.can_place_order) {
      return
    }

    const gateway =
      total === 0 ? PaymentGateway.NO_PAYMENT_REQUIRED : payment_gateway
    const available_items = items.filter(
      (item) =>
        !verifiedResponse?.unavailable_products?.includes(item.id.toString())
    )
    mutateOrder({
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
  }

  return (
    <>
      <Form<CreateOrderClientDataInput>
        onSubmit={createOrder}
        useFormProps={{
          defaultValues: {
            id: me?.id,
            fullname: me?.profile.fullname,
            email: me?.email,
            phone_number: me?.profile?.contact ?? '',
            is_company_invoice: false,
            city: '',
            address: '',
            post_code: '',
            company_name: '',
            tax_identification_number: '',
            country: '',
            accepted_terms_and_conditions: false
          }
        }}
        validationSchema={clientDataValidationSchema}
        className="flex flex-grow flex-col"
      >
        {({
          register,
          reset,
          control,
          setValue,
          getValues,
          formState: { errors },
          handleSubmit
        }) => (
          <div className="mx-auto flex h-full w-[80%] flex-col justify-between gap-3 p-4 pt-6 sm:p-5 sm:pt-8 md:pt-10 lg:flex-row 3xl:pt-12">
            <div className="fixed left-4 top-1/2 z-[5] -translate-y-1/2 transform">
              <Button
                variant="icon"
                onClick={handleBack}
                className="flex items-center justify-center"
              >
                <LongLeftArrowIcon id="back" className="h-4 w-4 rtl:order-1" />{' '}
                <span className="invisible md:visible">{t('text-back')}</span>
              </Button>
            </div>
            {!isEmpty && Boolean(verifiedResponse) ? (
              <div
                style={{ height: 'fit-content' }}
                className="mb-4 flex-grow bg-light shadow-card dark:bg-dark-250 dark:shadow-none md:mb-5 3xl:mb-6 "
              >
                <h2 className="flex items-center justify-between border-b border-light-400 px-5 py-4 text-sm font-medium text-dark dark:border-dark-400 dark:text-light sm:px-7 sm:py-5 md:text-base">
                  {t('text-checkout-title')}
                </h2>
                <div className="px-5 py-4 sm:px-7 sm:py-6">
                  <Input
                    id="fullname"
                    label={t('text-profile-name')}
                    defaultValue={me?.profile?.fullname}
                    {...register('fullname')}
                    error={errors?.fullname?.message}
                  />
                </div>
                <div className="px-5 py-4 sm:px-7 sm:py-6">
                  <Input
                    id="email"
                    disabled={true}
                    label={t('text-email')}
                    defaultValue={me?.email}
                    {...register('email')}
                    error={errors?.email?.message}
                  />
                </div>
                <div className="px-5 py-4 sm:px-7 sm:py-6">
                  <span className="block cursor-pointer pb-2.5 font-normal text-dark/70 dark:text-light/70">
                    {t('text-profile-contact')}
                  </span>
                  <Controller
                    control={control}
                    {...register('phone_number')}
                    render={({ field }) => (
                      <ReactPhone
                        country={language === 'en' ? 'us' : 'pl'}
                        {...field}
                      />
                    )}
                  />
                  {errors?.phone_number?.message && (
                    <span
                      role="alert"
                      className="block pt-2 text-xs text-warning"
                    >
                      {t('phone-number-is-required-error')}
                    </span>
                  )}
                </div>
                <div>
                  <div className="px-5 py-4 sm:px-7 sm:py-6">
                    <CheckBox
                      {...register('is_company_invoice')}
                      label={t('text-invoice-for-company')}
                      type="checkbox"
                      error={errors.is_company_invoice?.message}
                      onChange={(e) => {
                        setIsCompanyInvoice(e.target.checked)
                        setValue('is_company_invoice', e.target.checked)
                      }}
                    />
                  </div>
                  <div className="px-5 py-4 sm:px-7 sm:py-6">
                    <Select
                      id="country"
                      label={t('text-country')}
                      defaultValue={'Poland'}
                      {...register('country')}
                      options={countries.map((country) => {
                        return {
                          value: country.name,
                          label: country.name
                        }
                      })}
                      error={errors?.country?.message}
                    />
                  </div>
                  <div className="px-5 py-4 sm:px-7 sm:py-6">
                    <Input
                      id="city"
                      label={t('text-city')}
                      defaultValue={''}
                      {...register('city')}
                      error={errors?.city?.message}
                    />
                  </div>
                  <div className="px-5 py-4 sm:px-7 sm:py-6">
                    <Input
                      id="address"
                      label={
                        isCompanyInvoice
                          ? t('text-company-address')
                          : t('text-address')
                      }
                      defaultValue={''}
                      {...register('address')}
                      error={errors?.address?.message}
                    />
                  </div>
                  <div className="px-5 py-4 sm:px-7 sm:py-6">
                    <Input
                      id="address"
                      label={t('text-post-code')}
                      defaultValue={''}
                      {...register('post_code')}
                      error={errors?.post_code?.message}
                    />
                  </div>
                  {isCompanyInvoice && (
                    <div>
                      <div className="px-5 py-4 sm:px-7 sm:py-6">
                        <Input
                          id="company_name"
                          label={t('text-company-name')}
                          defaultValue={''}
                          {...register('company_name')}
                          error={errors?.company_name?.message}
                        />
                      </div>
                      <div className="px-5 py-4 sm:px-7 sm:py-6">
                        <Input
                          id="tax_identification_number"
                          label={t('text-tax-identification-number')}
                          defaultValue={''}
                          {...register('tax_identification_number')}
                          error={errors?.tax_identification_number?.message}
                        />
                      </div>
                    </div>
                  )}
                  <div className="px-5 py-4 sm:px-7 sm:py-6">
                    <CheckBox
                      id="accept_terms_and_conditions_checkbox"
                      {...register('accepted_terms_and_conditions')}
                      error={errors?.accepted_terms_and_conditions?.message}
                      defaultChecked={false}
                      label={termsLabel}
                    />
                  </div>
                </div>
              </div>
            ) : null}

            <div
              style={{ height: 'fit-content' }}
              className="flex-grow bg-light shadow-card dark:bg-dark-250 dark:shadow-none"
            >
              <h2 className="flex items-center justify-between border-b border-light-400 px-5 py-4 text-sm font-medium text-dark dark:border-dark-400 dark:text-light sm:px-7 sm:py-5 md:text-base">
                {t('text-checkout-title-two')}
                <span className="font-normal text-dark-700">
                  ({totalItems})
                </span>
              </h2>
              <div className="px-5 pt-9 sm:px-7 sm:pt-11">
                {!isEmpty ? (
                  <CartItemList className="pl-3" />
                ) : (
                  <>
                    <CartEmpty />
                    <div className="sticky bottom-11 z-[5] mt-10 border-t border-light-400 bg-light pb-7 pt-6 dark:border-dark-400 dark:bg-dark-250 sm:bottom-0 sm:mt-12 sm:pb-9 sm:pt-8">
                      <Button
                        onClick={() => router.push(routes.home)}
                        className="w-full md:h-[50px] md:text-sm"
                      >
                        <LongLeftArrowIcon className="h-4 w-4" />
                        {t('404-back-home')}
                      </Button>
                    </div>
                  </>
                )}
                {!isEmpty && Boolean(verifiedResponse) && (
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
                        <strong className="font-semibold">
                          {verifiedResponseTotal}
                        </strong>
                      </div>
                    </div>

                    {totalPrice === 0 ? null : <PaymentGrid />}

                    <Button
                      id="place-order-button"
                      type="submit"
                      disabled={
                        isVeryfingOrder ||
                        isCreatingOrder ||
                        !Boolean(verifiedResponse) ||
                        !verifiedResponse?.can_place_order
                      }
                      isLoading={isVeryfingOrder || isCreatingOrder}
                      className="w-full md:h-[50px] md:text-sm"
                    >
                      {t('text-submit-order')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Form>
    </>
  )
}

CheckoutPage.authorization = true
CheckoutPage.getLayout = function getLayout(page) {
  return <GeneralLayout>{page}</GeneralLayout>
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common']))
    },
    revalidate: 15 * 60 // In seconds
  }
}

export default CheckoutPage
