import { Attachment, Video } from '@/types'
import ProductThumbnailGallery from '../product/product-thumbnail-gallery'

// Gallery component
export const GameGallery: React.FC<{
  gallery?: Attachment[]
  videos?: Video[]
}> = ({ gallery, videos }) => (
  <div className="mt-6">
    <ProductThumbnailGallery gallery={gallery ?? []} videos={videos ?? []} />
  </div>
)
