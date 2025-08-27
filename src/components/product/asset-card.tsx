import { Asset } from '@/types'
import Router from 'next/router'
import { motion } from 'framer-motion'
import { useModalAction } from '@/components/modal-views/context'
import routes from '@/config/routes'
import { useGridSwitcher } from '@/components/product/grid-switcher'
import { fadeInBottomWithScaleX } from '@/lib/framer-motion/fade-in-bottom'
import { useMe } from '@/data/user'
import ReactPlayer from 'react-player'
import AssetCardMediaPreview from './asset-card-media-preview'
import AssetCardInfoSection from './asset-card-info-section'

export default function AssetCard({ product }: { product: Asset }) {
  const { name, slug, image } = product ?? {}
  const { openModal } = useModalAction()
  const { isGridCompact } = useGridSwitcher()
  const { me } = useMe()
  const isMine = me?.editable_assets?.includes(product.id)

  const goToDetailsPage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    Router.push(routes.assetUrl(slug))
  }

  const goToEditPage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    window.open(
      `${process.env.NEXT_PUBLIC_ADMIN_URL!}/assets/${product.id}/edit`,
      '_blank'
    )
  }
  const firstVideo = product?.videos?.find((item) =>
    ReactPlayer.canPlay(item.url)
  )

  return (
    <motion.div variants={fadeInBottomWithScaleX()} id={`product-card-${slug}`}>
      <AssetCardMediaPreview
        imageUrl={image.thumbnail}
        videoUrl={firstVideo?.url}
        alt={name}
        onHoverVideoAutoplay={product.on_hover_video_autoplay_enabled}
        slug={slug}
        isMine={isMine}
        onDetailsClick={goToDetailsPage}
        onEditClick={goToEditPage}
        openModal={openModal}
        isGridCompact={isGridCompact}
      />
      <AssetCardInfoSection product={product} me={me} />
    </motion.div>
  )
}
