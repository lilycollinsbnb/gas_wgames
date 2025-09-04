import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import type { NextPageWithLayout } from '@/types'
import React from 'react'

import Seo from '@/layouts/_seo'

import PageHeading from '@/components/ui/page-heading'
import routes from '@/config/routes'

import Layout from '@/layouts/_layout'
import ContactForm from '@/components/contact/contact-form'
import ContactDetails from '@/components/contact/contact-details'

const ContactUsPage: NextPageWithLayout = () => {
  const { t } = useTranslation('common')

  return (
    <>
      <Seo
        title="Contact Us - Support, Inquiries and Assistance"
        description="Get in touch with the Assets 4 Godot store team. Contact us for support, asset-related inquiries, or business collaborations. We're here to help with your questions and technical issues."
        url={routes.contact}
        canonical={routes.contact}
      />
      <div className="mx-auto flex h-full w-full max-w-screen-xl flex-col p-4 sm:p-5">
        <PageHeading
          title={t('contact-us-title')}
          subtitle={t('contact-us-subtitle')}
        />
        <div className="flex w-full flex-col overflow-hidden rounded-md px-4 py-5 sm:px-6 sm:py-8 md:bg-light md:p-10 md:shadow-card md:dark:bg-dark-200 md:dark:shadow-none lg:flex-row lg:p-0">
          {/* <ContactDetails /> */}
          <ContactForm />
        </div>
      </div>
    </>
  )
}

ContactUsPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common']))
    },
    revalidate: 15 * 60 // In seconds
  }
}

export default ContactUsPage
