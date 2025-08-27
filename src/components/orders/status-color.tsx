const StatusColor = (status: string) => {
  let bg_class = '';
  if (
    status?.toLowerCase() === 'order_pending' ||
    status?.toLowerCase() === 'payment_pending'
  ) {
    bg_class = 'bg-[#e6a31d]';
  } else if (
    status?.toLowerCase() === 'order_processing' ||
    status?.toLowerCase() === 'payment_processing'
  ) {
    bg_class = 'bg-[#F59E0B]';
  } else if (
    status?.toLowerCase() === 'order_completed' ||
    status?.toLowerCase() === 'payment_success'
  ) {
    bg_class = 'bg-[#478CBF]';
  } else if (
    status?.toLowerCase() === 'order_cancelled' ||
    status?.toLowerCase() === 'payment_reversal'
  ) {
    bg_class = 'bg-[#9CA3AF]';
  } else if (
    status?.toLowerCase() === 'order_failed' ||
    status?.toLowerCase() === 'payment_failed'
  ) {
    bg_class = 'bg-[#EF4444]';
  } else if (status?.toLowerCase() === 'order_at_local_facility') {
    bg_class = 'bg-[#10B981]';
  } else if (status?.toLowerCase() === 'order_out_for_delivery') {
    bg_class = 'bg-[#D9D9D9]';
  } else {
    bg_class = 'bg-[#F59E0B]';
  }

  return bg_class;
};

export default StatusColor;
