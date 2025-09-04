import { Card, PaymentGateway, PaymentIntentInfo } from '@/types';
import { Elements } from '@stripe/react-stripe-js';
import getStripe from '@/lib/get-stripejs';
import StripePaymentForm from '@/components/payment/stripe/stripe-payment-form-old';
import { useTranslation } from 'next-i18next';

interface Props {
  paymentIntentInfo: PaymentIntentInfo;
  orderId: string;
  paymentGateway: PaymentGateway;
  cards: Card[];
}

const StripePaymentModal: React.FC<Props> = ({
  paymentIntentInfo,
  orderId,
  paymentGateway,
  cards,
}) => {
  const { t } = useTranslation('common');

  return (
    <Elements stripe={getStripe()}>
        <StripePaymentForm
          paymentIntentInfo={paymentIntentInfo}
          orderId={orderId}
          paymentGateway={paymentGateway}
        />
    </Elements>
  );
};

export default StripePaymentModal;
