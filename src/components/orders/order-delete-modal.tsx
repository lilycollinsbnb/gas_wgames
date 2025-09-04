import ConfirmationCard from '@/components/ui/cards/confirmation'
import { useModalAction, useModalState } from '@/components/modal-views/context'
import { useDeleteOrder } from '@/data/order'
import { useTranslation } from 'react-i18next'

export default function OrderDeleteModal() {
  const {
    data: { order_id }
  } = useModalState()
  const { closeModal } = useModalAction()
  const { deleteOrder, isLoading } = useDeleteOrder()
  const { t } = useTranslation('common')

  function handleDelete() {
    if (!order_id) {
      return
    }
    deleteOrder(order_id)
  }

  return (
    <ConfirmationCard
      title={t('text-delete-order')}
      description={t('text-delete-order-confirmation')}
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnLoading={isLoading}
    />
  )
}
