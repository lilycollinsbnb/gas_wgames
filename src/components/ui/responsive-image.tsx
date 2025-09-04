import React from 'react'

interface ResponsiveImageProps {
  alt: string
  src: string
  placeholder?: string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  className?: string
  style?: React.CSSProperties
  srcSet?: { [key: string]: string } // Object of width descriptors to URLs
  sizes?: string // Similar to CSS `sizes` property (for responsive images)
  loading?: 'lazy' | 'eager' // Lazy loading option
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  alt,
  src,
  placeholder,
  objectFit = 'cover',
  className,
  style,
  srcSet,
  sizes,
  loading = 'lazy'
}) => {
  return (
    <div
      style={{
        display: 'flex'
      }}
      className={className}
    >
      <img
        src={src ?? placeholder} // Use placeholder if no source is available
        alt={alt}
        srcSet={
          srcSet
            ? Object.entries(srcSet)
                .map(([width, url]) => `${url} ${width}`)
                .join(', ')
            : ''
        }
        sizes={sizes}
        loading={loading} // Enable lazy loading if specified
        style={{
          objectFit: objectFit,
          width: '100%',
          height: '100%',
          ...style // Allow passing any additional styles
        }}
        className={className}
      />
    </div>
  )
}

export default ResponsiveImage
