import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import cn from 'classnames'
import Button from '@/components/ui/button'
import { useGridSwitcher } from '@/components/product/grid-switcher'
import ItemNotFound from '@/components/ui/item-not-found'
import rangeMap from '@/lib/range-map'
import { staggerTransition } from '@/lib/framer-motion/stagger-transition'
import { useTranslation } from 'next-i18next'
import { LoaderIcon } from 'react-hot-toast'
import { Game } from '@/types'
import GameCardLoader from './game-card-loader'
import GameCard from './game-card'

interface GridProps {
  games: Game[]
  onLoadMore?: () => void
  hasNextPage?: boolean
  isLoadingMore?: boolean
  isLoading?: boolean
  limit?: number
  isInfiniteScroll?: boolean
}

export default function GameGrid({
  games,
  onLoadMore,
  hasNextPage,
  isLoadingMore,
  isLoading,
  limit = 15,
  isInfiniteScroll = false
}: GridProps) {
  const { isGridCompact } = useGridSwitcher()
  const { t } = useTranslation('common')
  const loadMoreRef = useRef(null)

  useEffect(() => {
    if (isInfiniteScroll && hasNextPage && loadMoreRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isLoadingMore) {
            onLoadMore?.()
          }
        },
        {
          rootMargin: '100px'
        }
      )

      observer.observe(loadMoreRef.current)
      return () => observer.disconnect()
    }
  }, [isInfiniteScroll, hasNextPage, isLoadingMore, onLoadMore])

  if (!isLoading && !games.length) {
    return (
      <ItemNotFound
        title={t('text-no-games-found')}
        message={t('text-no-games-found-message')}
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
        {isLoading && !games.length
          ? rangeMap(limit, (i) => (
              <GameCardLoader key={i} uniqueKey={`game-${i}`} />
            ))
          : games.map((game) => <GameCard key={game.id} game={game} />)}
      </motion.div>

      {isInfiniteScroll
        ? hasNextPage && (
            <div
              ref={loadMoreRef}
              className="mt-8 grid place-content-center md:mt-10"
            >
              {isLoadingMore && (
                <LoaderIcon className="h-24 w-24 md:h-32 md:w-32 lg:h-40 lg:w-40 xl:h-52 xl:w-52 3xl:h-64 3xl:w-64" />
              )}
            </div>
          )
        : hasNextPage && (
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
