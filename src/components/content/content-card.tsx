import Image from '@/components/ui/image'
import AnchorLink from '@/components/ui/links/anchor-link'
import placeholder from '@/assets/images/placeholders/product.svg'
import ImageWithFallback from '../ui/image-with-fallback'

type ContentCardProps = {
  title: string
  image?: string
  description?: string | JSX.Element
  redirectLink?: string
  footer?: JSX.Element
}

export default function ContentCard({
  title,
  image,
  description,
  redirectLink,
  footer
}: ContentCardProps) {
  const imageComponent = (
    <div className="relative aspect-[16/9] w-full">
      {image && (
        <ImageWithFallback
          src={image || placeholder}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="absolute inset-0"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}
    </div>
  )

  const titleComponent = redirectLink ? (
    <AnchorLink
      href={redirectLink}
      className="hover:text-brand dark:hover:text-mint"
    >
      {title}
    </AnchorLink>
  ) : (
    title
  )

  return (
    <div className="group relative flex w-full flex-col overflow-hidden rounded-lg transition-all hover:shadow-xl">
      {/* Image Section */}
      {redirectLink ? (
        <AnchorLink href={redirectLink} className="w-full">
          {imageComponent}
        </AnchorLink>
      ) : (
        imageComponent
      )}

      {/* Info Section */}
      <div className="flex flex-col justify-between bg-light p-4 dark:bg-dark-300">
        <h3 className="truncate text-xl font-semibold text-dark dark:text-light">
          {titleComponent}
        </h3>
        {description && (
          <p className="mt-1 text-sm text-muted dark:text-light/70 line-clamp-2">
            {description}
          </p>
        )}
        {footer && <div className="mt-2">{footer}</div>}
      </div>
    </div>
  )
}
