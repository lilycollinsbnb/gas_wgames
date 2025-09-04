import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import type { NextPageWithLayout } from '@/types';
import GeneralLayout from '@/layouts/_general-layout';
import PageHeading from '@/components/ui/page-heading';
import GeneralContainer from '@/layouts/_general-container';
import { privacyPolicy } from '@/data/static/privacy-setting';
import Seo from '@/layouts/_seo';
import routes from '@/config/routes';
import { useLegalContent } from '@/data/legal-content';

const SellerAgreementPage: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  const { content, isLoading, error } = useLegalContent('seller_agreement');

  return (
    <>
      <Seo
        title="Seller Agreement - Terms for Selling Assets"
        description="2D and 3D assets for your Godot projects."
        url={routes.sellerAgreement}
      />
      <div className="mx-auto flex h-full w-full max-w-screen-xl flex-col p-4 sm:p-5">
        <PageHeading title={'Seller Agreement'} subtitle={''} />
        <GeneralContainer>
          <div
            className="space-y-5 leading-6"
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          />
        </GeneralContainer>
      </div>
    </>
  );
};

SellerAgreementPage.getLayout = function getLayout(page) {
  return <GeneralLayout>{page}</GeneralLayout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common'])),
    },
    revalidate: 15 * 60, // In seconds
  };
};

export default SellerAgreementPage;
