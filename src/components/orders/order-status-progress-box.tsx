import ProgressBox from '@/components/ui/progress-box/progress-box';
import { filterOrderStatus, ORDER_STATUS_EN, ORDER_STATUS_PL } from '@/lib/constants/order-status';
import { OrderStatus, PaymentStatus } from '@/types';
import { useRouter } from 'next/router';

interface Props {
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
}

interface GetCurrentIndexProps {
  language: string | undefined;
  orderStatus: OrderStatus | undefined;
}

const getCurrentIndex = ({language, orderStatus} : GetCurrentIndexProps) => {
  let index: number = 0;
  let translation = ORDER_STATUS_EN;
  switch (language) {
    case 'en':
      index = ORDER_STATUS_EN.findIndex((o) => o.status === orderStatus) ?? 0;
      translation = ORDER_STATUS_EN;
      break;
    case 'pl':
      index = ORDER_STATUS_PL.findIndex((o) => o.status === orderStatus) ?? 0;
      translation = ORDER_STATUS_PL;
      break;
    default:
      index = 0;
      translation = ORDER_STATUS_EN;
      break;
  }

  return {index: index, translation: translation};
}

const OrderStatusProgressBox = ({ paymentStatus, orderStatus }: Props) => {
  const router = useRouter();
  const { locale } = router;
  const {index, translation} = getCurrentIndex({language: locale, orderStatus})
  const filterStatus = filterOrderStatus(
    translation,
    paymentStatus!,
    index
  );

  return (
    <ProgressBox
      data={filterStatus}
      status={orderStatus!}
      filledIndex={index}
    />
  );
};

export default OrderStatusProgressBox;
