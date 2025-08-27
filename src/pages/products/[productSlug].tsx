import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType
} from 'next'
import { useRouter } from 'next/router'
import {
  type NextPageWithLayout,
  type Asset,
  type Settings,
  ItemType
} from '@/types'
import { motion } from 'framer-motion'
import Layout from '@/layouts/_layout'
import client from '@/data/client'
import ProductSocialShare from '@/components/product/product-social-share'
import ProductInformation from '@/components/product/product-information'
import ProductDetailsPaper from '@/components/product/product-details-paper'
import { LongLeftArrowIcon } from '@/components/icons/long-arrow-left-icon'
import { staggerTransition } from '@/lib/framer-motion/stagger-transition'
import routes from '@/config/routes'
import {
  fadeInBottom,
  fadeInBottomWithScaleX,
  fadeInBottomWithScaleY
} from '@/lib/framer-motion/fade-in-bottom'
import placeholder from '@/assets/images/placeholders/product.svg'
import AverageRatings from '@/components/review/average-ratings'
import isEmpty from 'lodash/isEmpty'
import invariant from 'tiny-invariant'
import { truncateDescription } from '@/lib/truncate-description'
import Seo from '@/layouts/_seo'
import MarkdownRenderer from '@/components/ui/markdown-renderer'
import { seoSettings } from '@/layouts/_default-seo'
import ImageWithFallback from '@/components/ui/image-with-fallback'

// This function gets called at build time
type ParsedQueryParams = {
  productSlug: string
}

const validateYouTubeUrl = (url: string): boolean => {
  const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/
  return regex.test(url)
}

const getYouTubeVideoId = (url: string): string => {
  const urlParts = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)
  return urlParts[2] !== undefined ? urlParts[2].split(/[^\w-]/)[0] : ''
}

const youtubeVideoStyles = {
  videoContainer: {
    position: 'relative' as 'relative',
    paddingBottom: '56.25%' /* 16:9 aspect ratio */,
    height: 0,
    overflow: 'hidden' as 'hidden',
    maxWidth: '100%',
    background: '#000',
    backgroundColor: '#252525'
  },
  iframe: {
    position: 'absolute' as 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  }
}

export const getStaticPaths: GetStaticPaths<ParsedQueryParams> = async ({
  locales
}) => {
  invariant(locales, 'locales is not defined')
  const { data } = await client.assets.all({ limit: 100 })
  const paths = data?.flatMap((product) =>
    locales?.map((locale) => ({
      params: { productSlug: product.slug },
      locale
    }))
  )
  return {
    paths,
    fallback: 'blocking'
  }
}

type PageProps = {
  product: Asset
  settings: Settings
}

export const getStaticProps: GetStaticProps<
  PageProps,
  ParsedQueryParams
> = async ({ params, locale }) => {
  const { productSlug } = params!
  try {
    const product = await client.assets.get({
      slug: productSlug,
      language: locale
    })
    const settings = await client.settings.all()
    return {
      props: {
        product,
        settings,
        ...(await serverSideTranslations(locale!, ['common']))
      },
      revalidate: 15 * 60 // In seconds
    }
  } catch (error) {
    return {
      notFound: true,
      revalidate: 15 * 60
    }
  }
}

function getPreviews(gallery: any[], image: any) {
  if (!isEmpty(gallery) && Array.isArray(gallery)) return gallery
  if (!isEmpty(image)) return [image, {}]
  return [{}, {}]
}

const ProductPage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ product, settings }) => {
  const { t } = useTranslation('common')
  const {
    id,
    name,
    slug,
    image,
    gallery,
    description,
    created_at,
    updated_at,
    ratings,
    rating_count,
    total_reviews,
    tags,
    custom_tags,
    categories,
    videos,
    godot_version,
    license
  } = product

  const router = useRouter()
  const previews = getPreviews(gallery, image)
  const youtubeVideoIds = videos
    ?.filter((x) => validateYouTubeUrl(x.url))
    .map((x) => getYouTubeVideoId(x.url))

  const previewsCount = previews ? previews?.length : 0
  const youtubeVideosCount = youtubeVideoIds ? youtubeVideoIds?.length : 0
  const galleryItemsCount = previewsCount + youtubeVideosCount

  const handleBackButtonClick = () => {
    const cameFromInsideApp =
      typeof document !== 'undefined' &&
      document.referrer.includes(window.location.host)

    if (window.history.length > 1 && cameFromInsideApp) {
      router.back()
    } else {
      router.push(routes.home)
    }
  }

  return (
    <div className="relative">
      <Seo
        title={`${name}`}
        description={`${name} - ${truncateDescription(description, 160)}`}
        url={routes.assetUrl(slug)}
        canonical={`${routes.assetUrl(slug)}`}
        images={[
          {
            url: image.original,
            width: 800,
            height: 600,
            alt: `${name} - details page`
          }
        ]}
      />
      <div className="h-full min-h-screen bg-white p-4 dark:bg-dark-100 md:px-6 lg:px-8 lg:pt-6">
        <div className="sticky top-0 z-20 -mx-4 -mt-2 mb-1 flex items-center p-4 dark:bg-dark-100 sm:static sm:top-auto sm:z-0 sm:m-0 sm:mb-4 sm:bg-transparent sm:p-0 sm:dark:bg-transparent">
          <button
            onClick={handleBackButtonClick}
            className="group inline-flex items-center gap-1.5 font-medium text-dark/70 hover:text-dark rtl:flex-row-reverse dark:text-light/70 hover:dark:text-light lg:mb-6"
          >
            <LongLeftArrowIcon className="h-4 w-4" />
            {t('text-back')}
          </button>
        </div>
        <motion.div
          variants={staggerTransition()}
          className="grid gap-4 sm:grid-cols-2 lg:gap-6"
        >
          {youtubeVideoIds?.map((item, idx) => (
            <motion.div
              key={`video-${idx}`}
              variants={fadeInBottomWithScaleX()}
              className="relative aspect-[16/9]"
            >
              <div style={youtubeVideoStyles.videoContainer}>
                <iframe
                  style={youtubeVideoStyles.iframe}
                  src={`https://www.youtube.com/embed/${item}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          ))}
          {previews?.map((img, idx) => (
            <motion.div
              key={`${img}-idx-1`}
              variants={fadeInBottomWithScaleX()}
              className="relative aspect-[16/9]"
            >
              <div style={youtubeVideoStyles.videoContainer}>
                <ImageWithFallback
                  alt={name}
                  fill
                  objectFit="cover"
                  quality={100}
                  src={img?.original ?? placeholder}
                  className="bg-light-500 object-cover dark:bg-dark-300"
                />
              </div>
            </motion.div>
          ))}
          {galleryItemsCount === 1 && (
            <motion.div
              variants={fadeInBottomWithScaleX()}
              className="hide-on-mobile relative aspect-[16/9]"
            >
              <div style={youtubeVideoStyles.videoContainer}>
                <ImageWithFallback
                  alt={name}
                  objectFit="cover"
                  fill
                  quality={100}
                  src={placeholder}
                  className="hide-on-mobile bg-light-500 object-cover dark:bg-dark-300"
                />
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          variants={fadeInBottom()}
          className="justify-center py-6 lg:flex lg:flex-col lg:py-10"
        >
          <ProductDetailsPaper
            product={{ ...product, item_type: ItemType.Asset }}
            className="lg:hidden"
            favButtonId="fav-button-m"
          />
          <div className="w-full rtl:space-x-reverse xl:space-x-20 3xl:space-x-28">
            <div className="lg:block">
              <MarkdownRenderer
                content={description ?? ''}
                className="overflow-y-auto pb-5 leading-[1.9em]"
              />
              <ProductInformation
                tags={tags}
                customTags={custom_tags}
                categories={categories}
                created_at={created_at}
                updated_at={updated_at}
                godotVersion={godot_version}
                license={license}
                //@ts-ignore
                className="flex-shrink-0 pb-6 pt-2.5 lg:pb-0"
              />
            </div>

            <div className="mt-4 w-full md:mt-8 md:space-y-10 lg:mt-12 lg:flex lg:flex-col lg:space-y-12">
              <AverageRatings
                ratingCount={rating_count}
                totalReviews={total_reviews}
                ratings={ratings}
              />
              {/* TODO */}
              {/* <ProductReviews productId={id} />
              <ProductQuestions
                productId={product?.id}
                shopId={product?.shop?.id}
              /> */}
            </div>
          </div>
          <ProductSocialShare
            productSlug={slug}
            className="border-t border-light-500 pt-5 dark:border-dark-400 md:pt-7"
          />
        </motion.div>
      </div>
      <motion.div
        variants={fadeInBottomWithScaleY()}
        className="sticky bottom-0 right-0 z-10 hidden h-[100px] w-full border-t border-light-500 bg-light-100 px-8 py-5 dark:border-dark-400 dark:bg-dark-200 lg:flex 3xl:h-[120px]"
      >
        <ProductDetailsPaper
          product={{ ...product, item_type: ItemType.Asset }}
          favButtonId="fav-button"
        />
      </motion.div>
    </div>
  )
}

ProductPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default ProductPage
