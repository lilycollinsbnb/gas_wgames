import type { BlogPost } from '@/types'
import { motion } from 'framer-motion'
import AnchorLink from '@/components/ui/links/anchor-link'
import routes from '@/config/routes'
import placeholder from '@/assets/images/placeholders/product.svg'
import { useTranslation } from 'next-i18next'
import ImageWithFallback from '../ui/image-with-fallback'

export default function BlogCard({ blogPost }: { blogPost: BlogPost }) {
  const { title, slug, image, description } = blogPost ?? {}
  const { t } = useTranslation('common')

  return (
    <motion.div
      id={`blog-card-${slug}`}
      className="group relative flex flex-col border border-gray-200 bg-white shadow-md transition-all duration-200 hover:shadow-lg dark:border-gray-700 dark:bg-dark-250"
    >
      <div className="relative flex aspect-[4/3] w-full justify-center overflow-hidden">
        <AnchorLink href={routes.blogPostUrl(slug)}>
          <ImageWithFallback
            alt={title}
            fill
            objectFit="cover"
            quality={100}
            src={image?.thumbnail ?? placeholder}
            className="bg-light-500 object-cover dark:bg-dark-250"
            sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
          />
        </AnchorLink>
      </div>
      <div className="flex flex-col bg-white p-4 dark:bg-dark-250">
        <div className="mb-2 flex flex-col">
          <h3
            title={title}
            className="mb-1 text-lg font-semibold text-dark-100 dark:text-white"
          >
            <AnchorLink href={routes.blogPostUrl(slug)}>{title}</AnchorLink>
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {/* Add author here*/}
          </p>
        </div>
        <div className="line-clamp-3 text-sm text-gray-700 dark:text-gray-300">
          {description}
        </div>
      </div>
      {/* <div className="absolute left-0 top-0 z-10 flex h-full w-full cursor-pointer items-center justify-center bg-dark/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-dark/70">
        <button className="text-light text-sm font-medium">Read More</button>
      </div> */}
    </motion.div>
  )
}
