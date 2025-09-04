import { useShopById } from '@/data/shop'
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import MarkdownRenderer from '../ui/markdown-renderer'
import { Shop } from '@/types'

export default function AboutShop({ shop }: { shop: Shop }) {
  const { t } = useTranslation('common')

  const { products_count, about } = shop ?? {
    about: '',
    name: '',
    products_count: 0
  }

  return (
    <motion.div
      variants={fadeInBottom()}
      className="mx-auto flex max-w-[480px] flex-col justify-between md:max-w-[1000px] md:flex-row 2xl:max-w-[1280px]"
    >
      <div className="flex-shrink-0 md:w-6/12 lg:w-7/12 xl:w-5/12">
        <MarkdownRenderer content={about} className="leading-6" />
        <div className="space-y-3.5 pt-4 text-dark/80 dark:text-light/80 md:pt-6 xl:pt-7">
          {/* <address className="flex max-w-sm items-start not-italic leading-[1.8]">
              <span className="mt-[3px] w-7 shrink-0 text-dark-800 dark:text-light-900">
                <MapPinIcon className="h-4 w-4" />
              </span>
              {formatAddress(address)}
            </address> */}
          {/* <div className="flex items-center">
              <span className="w-7 shrink-0 text-dark-800 dark:text-light-900">
                <AtIcon className="h-4 w-4" />
              </span>
              <a href={`mailto:${owner?.email}`} className="hover:text-brand">
                {owner?.email}
              </a>
            </div> */}
        </div>
      </div>
      <div className="mt-7 flex-shrink-0 rounded-md bg-light p-6 shadow-card dark:bg-dark-250 md:mt-0 md:w-72 lg:p-8">
        <div className="-mx-2 flex pb-6 lg:pb-7">
          <div className="flex flex-shrink-0 flex-col px-2 pr-10 text-13px capitalize text-dark-500 dark:text-light-900 xl:w-1/2 xl:pr-0">
            <span className="mb-0.5 text-2xl text-dark dark:text-light">
              {products_count}
            </span>
            {t('text-products')}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
