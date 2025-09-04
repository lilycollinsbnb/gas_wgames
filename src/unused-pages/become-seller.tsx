import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import type {
  BecomeSellerInput,
  NextPageWithLayout,
  UpdateProfileInput,
} from '@/types';
import type { SubmitHandler } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { m, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DashboardLayout from '@/layouts/_dashboard';
import { Form } from '@/components/ui/forms/form';
import Input from '@/components/ui/forms/input';
import Textarea from '@/components/ui/forms/textarea';
import { ReactPhone } from '@/components/ui/forms/phone-input';
import Button from '@/components/ui/button';
import client from '@/data/client';
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom';
import { useMe } from '@/data/user';
import pick from 'lodash/pick';
import { API_ENDPOINTS } from '@/data/client/endpoints';
import Uploader from '@/components/ui/forms/uploader';
import * as yup from 'yup';
import CheckBox from '@/components/ui/forms/checkbox';
import { SELLER } from '@/components/auth/permissions';
import useAuth from '@/components/auth/use-auth';
import routes from '@/config/routes';
import { useRouter } from 'next/router';



const BecomeSellerPage: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  const { me, isAuthorized, permissions } = useMe();
  const { addPermission } = useAuth();
  const isSeller = permissions.includes(SELLER);
  const queryClient = useQueryClient();
  const router = useRouter();
  const becomeSellerValidationSchema = yup.object().shape({
    id: yup.string().required(),
    acceptedTermsAndConditions: yup.boolean().required().oneOf([true], t('accept-seller-agreement-error')),
  });
  
  // const { mutate, isLoading } = useMutation(
  //   client.users.upgradeAccountToSeller,
  //   {
  //     onSuccess: () => {
  //       toast.success(<b>{t('text-become-seller-success')}</b>, {
  //         className: '-mt-10 xs:mt-0',
  //       });
  //       addPermission(SELLER);
  //       router.push('/');
  //     },
  //     onError: (error) => {
  //       toast.error(<b>{t('text-become-seller-error')}</b>, {
  //         className: '-mt-10 xs:mt-0',
  //       });
  //       console.log(error);
  //     },
  //   }
  // );
  // const onSubmit: SubmitHandler<BecomeSellerInput> = (data) => {
  //   mutate(data);
  // }

  return (
    <motion.div
      variants={fadeInBottom()}
      className="flex min-h-full flex-grow flex-col"
    >
      <h1 className="mb-5 text-15px font-medium text-dark dark:text-light sm:mb-6">
        {t('text-become-seller')}
      </h1>
      <Form<BecomeSellerInput>
        // onSubmit={onSubmit}
        onSubmit={()=>{}}
        useFormProps={{
          defaultValues: {
            id: me?.id,
            acceptedTermsAndConditions: false,
          },
        }}
        validationSchema={becomeSellerValidationSchema}
        className="flex flex-grow flex-col"
      >
        {({ register, reset, control, formState: { errors } }) => (
          <div>
            <a href={routes.sellerAgreement} target="_self" rel="noreferrer">
              {t('text-read-seller-agreement')}
            </a>
            <CheckBox
              {...register('acceptedTermsAndConditions')}
              label={t('text-agree-to-accept-seller-agreement')}
              type="checkbox"
              error={errors.acceptedTermsAndConditions?.message}
              className="mb-5"
            />
            {isSeller && (
              <p className="mb-5">
                {t('text-already-have-seller-permissions')}
              </p>
            )}
            <Button
              id="confirm-become-seller"
              type='submit'
              className="w-full flex-1 lg:flex-none"
              // isLoading={isLoading}
              // disabled={isLoading || isSeller}
            >
              {t('text-confirm-become-seller')}
            </Button>
          </div>
        )}
      </Form>
    </motion.div>
  );
};

BecomeSellerPage.authorization = true;
BecomeSellerPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common'])),
    },
    revalidate: 60, // In seconds
  };
};

export default BecomeSellerPage;
