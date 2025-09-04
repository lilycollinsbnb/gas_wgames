import { Elements } from '@stripe/react-stripe-js';
import getStripe from '@/lib/get-stripejs';
import StripeOneTimePaymentForm from './stripe-one-time-payment-form';
import { useModalState } from '@/components/modal-views/context';



const StripeOneTimePaymentModal: React.FC = () => {
  const { data } = useModalState()

  return (
    <div className="modal-content-container">
            <Elements stripe={getStripe()} options={{
                clientSecret: data.paymentIntent.client_secret!,
                appearance: {
                    theme: 'stripe',
                }}}>
                <StripeOneTimePaymentForm orderId={data.orderId} refreshPage={data.refreshPage}/>
            </Elements>
        </div>
  );
};

export default StripeOneTimePaymentModal;
