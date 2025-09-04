import type { BlogPost } from '@/types'
import { motion } from 'framer-motion'
import cn from 'classnames'
import Button from '@/components/ui/button'
import { useGridSwitcher } from '@/components/product/grid-switcher'
import ItemNotFound from '@/components/ui/item-not-found'
import rangeMap from '@/lib/range-map'
import { staggerTransition } from '@/lib/framer-motion/stagger-transition'
import { useTranslation } from 'next-i18next'
import BlogCard from './card'
import BlogPostCardLoader from './blog-post-loader'

interface GridProps {
  blogPosts: BlogPost[]
  onLoadMore?: () => void
  hasNextPage?: boolean
  isLoadingMore?: boolean
  isLoading?: boolean
  limit?: number
}

export default function BlogGrid({
  blogPosts,
  onLoadMore,
  hasNextPage,
  isLoadingMore,
  isLoading,
  limit = 15
}: GridProps) {
  const { isGridCompact } = useGridSwitcher()
  const { t } = useTranslation('common')
  if (!isLoading && !blogPosts.length) {
    return (
      <ItemNotFound
        title={t('text-no-products-found')}
        message={t('text-no-products-found-message')}
        className="px-4 pb-10 pt-5 md:px-6 md:pt-6 lg:px-7 lg:pb-12 3xl:px-8"
      />
    )
  }
  return (
    <div className="w-full px-4 pb-9 pt-5 md:px-6 md:pb-10 md:pt-6 lg:px-7 lg:pb-12 3xl:px-8">
      <motion.div
        variants={staggerTransition(0.025)}
        className={cn(
          'grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] lg:gap-6 3xl:gap-7',
          {
            '2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]':
              isGridCompact,
            '2xl:grid-cols-3 3xl:grid-cols-[repeat(auto-fill,minmax(340px,1fr))] 4xl:grid-cols-[repeat(auto-fill,minmax(380px,1fr))]':
              !isGridCompact
          }
        )}
      >
        {isLoading && !blogPosts.length
          ? rangeMap(limit, (i) => (
              <BlogPostCardLoader key={i} uniqueKey={`blog-post-${i}`} />
            ))
          : blogPosts.map((blogPost) => (
              <BlogCard key={blogPost.id} blogPost={blogPost} />
            ))}
      </motion.div>

      {hasNextPage && (
        <div className="mt-8 grid place-content-center md:mt-10">
          <Button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            isLoading={isLoadingMore}
          >
            {t('text-loadmore')}
          </Button>
        </div>
      )}
    </div>
  )
}
