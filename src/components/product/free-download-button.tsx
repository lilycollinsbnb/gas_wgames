import Button from '@/components/ui/button'
import { useTranslation } from 'next-i18next'
import { useMutation } from 'react-query'
import client from '@/data/client'
import { download } from '@/lib/download-asset'
import { ItemType, type AddToCartItem } from '@/types'

interface Props {
  item: AddToCartItem
  className?: string
}

export default function FreeDownloadButton({ item, className }: Props) {
  const { t } = useTranslation('common')

  const { mutate: downloadAsset } = useMutation(
    client.orders.generateDownloadFreeAssetLink,
    {
      onSuccess: (data) => download(data)
    }
  )

  // needs to be replaced
  // const { mutate: downloadGame } = useMutation(
  //   client.orders.generateDownloadGameLink,
  //   {
  //     onSuccess: (data) => download(data)
  //   }
  // )

  const handleDownload = () => {
    if (item.item_type === ItemType.Asset) {
      downloadAsset({ id: item.id })
    } else if (item.item_type === ItemType.Game) {
      // needs to be implemented on
      // downloadGame({ id: item.id })
    }
  }

  return (
    <Button
      title="free-download"
      id={'free-download-' + item.slug}
      onClick={handleDownload}
      className={className}
    >
      {t('text-download')}
    </Button>
  )
}
