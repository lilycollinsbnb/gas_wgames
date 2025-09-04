import { PaymentStatus } from '@/types';

// export const ORDER_STATUS = [
//   { name: 'Order Pending', status: 'order-pending', serial: 1 },
//   { name: 'Order Processing', status: 'order-processing', serial: 2 },
//   {
//     name: 'Order At Local Facility',
//     status: 'order-at-local-facility',
//     serial: 3,
//   },
//   {
//     name: 'Order Out For Delivery',
//     status: 'order-out-for-delivery',
//     serial: 4,
//   },
//   { name: 'Order Completed', status: 'order-completed', serial: 5 },
//   { name: 'Order Cancelled', status: 'order-cancelled', serial: 5 },
//   { name: 'Order Refunded', status: 'order-refunded', serial: 5 },
//   { name: 'Order Failed', status: 'order-failed', serial: 5 },
// ];

export const ORDER_STATUS_EN = [
  { name: 'Order processed by the system', status: 'order_pending', serial: 1 },
  { name: 'Order completed', status: 'order_completed', serial: 2 },
  { name: 'Order cancelled', status: 'order_cancelled', serial: 2 },
  { name: 'Order refunded', status: 'order_refunded', serial: 2 },
  { name: 'Order failed', status: 'order_failed', serial: 2 },
];

export const ORDER_STATUS_PL = [
  { name: 'Przetwarzanie zamówienia przez system', status: 'order_pending', serial: 1 },
  { name: 'Zamówienie zrealizowane', status: 'order_completed', serial: 2 },
  { name: 'Zamówienie anulowane', status: 'order_cancelled', serial: 2 },
  { name: 'Zamówienie zwrócone', status: 'order_refunded', serial: 2 },
  { name: 'Zamówienie nieudane', status: 'order_failed', serial: 2 },
];

export const filterOrderStatus = (
  orderStatus: any[],
  paymentStatus: PaymentStatus,
  currentStatusIndex: number
) => {
  if ([PaymentStatus.SUCCESS].includes(paymentStatus)) {
    return currentStatusIndex > 1
      ? [...orderStatus.slice(0, 1), orderStatus[currentStatusIndex]]
      : orderStatus.slice(0, 2);
  }

  return currentStatusIndex > 1
    ? [...orderStatus.slice(0, 2), orderStatus[currentStatusIndex]]
    : orderStatus.slice(0, 2);
};
