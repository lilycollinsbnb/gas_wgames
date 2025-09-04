import { useSettings } from '@/data/settings'
import NextImage, { ImageProps } from 'next/image'

type Props = ImageProps

const ImageWithFallback: React.FC<Props> = (props) => {
  const { settings } = useSettings()
  const src =
    typeof props.src === 'string' ? props.src : (props.src?.toString() ?? '')

  const isGif = src?.toLowerCase().endsWith('.gif')

  if (isGif) {
    // Render normal <img> for GIFs to preserve animation
    return (
      <img
        {...props}
        src={src}
        alt={props.alt || ''}
        className={props.className}
        style={props.style}
      />
    )
  }

  // Default to Next.js <Image /> for all other formats
  return <NextImage {...props} unoptimized={settings?.useUnoptimizedImages} />
}

export default ImageWithFallback
