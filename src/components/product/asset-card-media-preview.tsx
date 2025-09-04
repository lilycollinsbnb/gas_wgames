import { useState } from 'react'
import ReactPlayer from 'react-player'
import ImageWithFallback from '../ui/image-with-fallback'
import LazyLoadYouTube from './youtube-lazy-loader'
import { useTranslation } from 'next-i18next'
import { PreviewIcon } from '@/components/icons/preview-icon'
import { DetailsIcon } from '@/components/icons/details-icon'
import cn from 'classnames'
import { MODAL_VIEWS } from '../modal-views/context'

interface Props {
  imageUrl: string
  videoUrl?: string
  alt: string
  onHoverVideoAutoplay: boolean
  slug: string
  isMine: boolean | undefined
  onDetailsClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  onEditClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  openModal: (view: MODAL_VIEWS, payload?: unknown) => void
  isGridCompact?: boolean
}

export default function AssetCardMediaPreview({
  imageUrl,
  videoUrl,
  alt,
  onHoverVideoAutoplay,
  slug,
  isMine,
  onDetailsClick,
  onEditClick,
  openModal,
  isGridCompact = false
}: Props) {
  const [playing, setPlaying] = useState(false)
  const { t } = useTranslation('common')

  const isYouTubeLink = videoUrl && ReactPlayer.canPlay(videoUrl)

  const onMouseEnter = () => {
    if (onHoverVideoAutoplay && videoUrl) {
      setPlaying(true)
    }
  }

  const onMouseLeave = () => {
    setPlaying(false)
  }

  return (
    <div
      className="group relative flex aspect-[16/9] w-full justify-center overflow-hidden"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* IMAGE: Only visible if not playing or video is not available */}
      {(!playing || !videoUrl || !onHoverVideoAutoplay) && (
        <ImageWithFallback
          alt={alt}
          fill
          objectFit="cover"
          quality={100}
          src={imageUrl}
          className="absolute inset-0 bg-light-500 object-cover dark:bg-dark-400"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}

      {/* VIDEO */}
      {playing &&
        videoUrl &&
        onHoverVideoAutoplay &&
        (isYouTubeLink ? (
          <LazyLoadYouTube videoUrl={videoUrl} playing muted />
        ) : (
          <OnHoverVideoPlayer videoSrc={videoUrl!} />
        ))}

      {/* ACTION BUTTONS */}
      <div
        onClick={() => openModal('PRODUCT_DETAILS', { slug })}
        className="justify-left absolute left-0 top-0 z-10 flex cursor-pointer items-center gap-2 bg-dark/10 p-2 opacity-0 transition-all group-hover:opacity-100 dark:bg-dark/70"
      >
        {/* Preview */}
        <button
          aria-label="Product Preview"
          className={cn(
            'text-center font-medium text-light',
            isGridCompact ? 'text-xs' : 'text-13px'
          )}
        >
          <div
            className={cn(
              'mb-2 flex items-center justify-center bg-dark-800 text-light backdrop-blur-sm transition-all hover:bg-brand',
              isGridCompact ? 'h-11 w-11' : 'h-[50px] w-[50px]'
            )}
          >
            <PreviewIcon
              className={cn(isGridCompact ? 'h-4 w-4' : 'h-5 w-5')}
            />
          </div>
          <div className="justify-center backdrop-blur-sm">
            {t('text-preview')}
          </div>
        </button>

        {/* Details */}
        <button
          aria-label="Product Details"
          onClick={onDetailsClick}
          className={cn(
            'relative z-[11] text-center font-medium text-light',
            isGridCompact ? 'text-xs' : 'text-13px'
          )}
        >
          <div
            className={cn(
              'mb-2 flex items-center justify-center bg-dark-800 text-light backdrop-blur-sm transition-all hover:bg-brand',
              isGridCompact ? 'h-11 w-11' : 'h-[50px] w-[50px]'
            )}
          >
            <DetailsIcon
              className={cn(isGridCompact ? 'h-4 w-4' : 'h-5 w-5')}
            />
          </div>
          <div className="justify-center backdrop-blur-sm">
            {t('text-details')}
          </div>
        </button>

        {/* Edit (if mine) */}
        {isMine && (
          <button
            aria-label="Edit Product"
            onClick={onEditClick}
            className={cn(
              'relative z-[11] text-center font-medium text-light',
              isGridCompact ? 'text-xs' : 'text-13px'
            )}
          >
            <div
              className={cn(
                'mb-2 flex items-center justify-center bg-dark-800 text-light backdrop-blur-sm transition-all hover:bg-brand',
                isGridCompact ? 'h-11 w-11' : 'h-[50px] w-[50px]'
              )}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1 12.5V15H3.5L13.87 4.63L11.37 2.13L1 12.5ZM15.58 2.91C15.85 2.64 15.85 2.21 15.58 1.94L14.06 0.42C13.79 0.15 13.36 0.15 13.09 0.42L11.66 1.85L14.16 4.35L15.58 2.91Z" />
              </svg>
            </div>
            <div className="justify-center backdrop-blur-sm">
              {t('text-edit')}
            </div>
          </button>
        )}
      </div>
    </div>
  )
}

function OnHoverVideoPlayer({ videoSrc }: { videoSrc: string }) {
  return (
    <video
      className="bg-light-500 object-cover dark:bg-dark-400"
      src={videoSrc}
      style={{
        position: 'absolute',
        height: '100%',
        width: '100%',
        inset: '0px',
        objectFit: 'cover',
        color: 'transparent'
      }}
      onMouseOver={(e: React.MouseEvent<HTMLVideoElement>) =>
        (e.currentTarget as HTMLVideoElement).play()
      }
      onMouseOut={(e: React.MouseEvent<HTMLVideoElement>) => {
        const video = e.currentTarget as HTMLVideoElement
        video.pause()
        video.currentTime = 0
      }}
      muted
    >
      Your browser does not support the video tag.
    </video>
  )
}
