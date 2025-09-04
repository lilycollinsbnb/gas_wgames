import {
  Swiper,
  SwiperSlide,
  SwiperOptions,
  Navigation,
  Thumbs,
  FreeMode
} from '@/components/ui/slider'
import { useRef, useState } from 'react'
import { ChevronLeft } from '@/components/icons/chevron-left'
import { ChevronRight } from '@/components/icons/chevron-right'
import placeholder from '@/assets/images/placeholders/product.svg'
import ImageWithFallback from '../ui/image-with-fallback'

interface Props {
  gallery: any[]
  videos?: any[]
  className?: string
}

const swiperParams: SwiperOptions = {
  slidesPerView: 1,
  spaceBetween: 0
}

const validateYouTubeUrl = (url: string): boolean => {
  const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/
  return regex.test(url)
}

const getYouTubeVideoId = (url: string): string => {
  const urlParts = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)
  return urlParts[2] !== undefined ? urlParts[2].split(/[^\w-]/)[0] : ''
}

const getThumbnailUrl = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/default.jpg`
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
    height: '100%',
    aspectRatio: '16/9'
  }
}

export default function ProductThumbnailGallery({
  gallery,
  videos,
  className = 'w-full'
}: Props) {
  let [thumbsSwiper, setThumbsSwiper] = useState<any>(null)
  const prevRef = useRef<HTMLDivElement>(null)
  const nextRef = useRef<HTMLDivElement>(null)
  const youtubeVideoIds = videos
    ?.filter((x) => validateYouTubeUrl(x.url))
    .map((x) => getYouTubeVideoId(x.url))

  return (
    <div className={className}>
      <div className="relative mb-3 w-full overflow-hidden xl:mb-5">
        <Swiper
          id="productGallery"
          speed={400}
          allowTouchMove={false}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null
          }}
          modules={[Navigation, Thumbs, FreeMode]}
          navigation={{
            prevEl: prevRef.current!,
            nextEl: nextRef.current!
          }}
          {...swiperParams}
        >
          {youtubeVideoIds?.map((item, idx) => (
            <SwiperSlide
              key={`product-video-index-${idx}`}
              className="relative flex aspect-[16/9] items-center justify-center"
            >
              {/* <div style={youtubeVideoStyles.videoContainer}> */}
              <iframe
                style={youtubeVideoStyles.iframe}
                src={`https://www.youtube.com/embed/${item}`}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              {/* </div> */}
            </SwiperSlide>
          ))}
          {gallery?.map((item: any, idx) => (
            <SwiperSlide
              key={`product-gallery-${idx}`}
              className="relative flex aspect-[16/9] items-center justify-center bg-light-200 dark:bg-dark-200"
            >
              <ImageWithFallback
                fill
                objectFit="cover"
                src={item?.original ?? placeholder}
                alt={`Product gallery ${idx}`}
                className="object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute top-2/4 z-10 flex w-full items-center justify-between px-2.5 xl:px-4">
          <div
            ref={prevRef}
            className="flex h-8 w-8 -translate-y-1/2 transform cursor-pointer items-center justify-center rounded-full border border-light-400 bg-light text-dark/90 shadow-xl transition duration-300 hover:bg-light-200 hover:text-brand-dark focus:outline-none rtl:rotate-180 xl:h-9 xl:w-9"
          >
            <ChevronLeft className="h-4 w-4 xl:h-[18px] xl:w-[18px]" />
          </div>
          <div
            ref={nextRef}
            className="flex h-8 w-8 -translate-y-1/2 transform cursor-pointer items-center justify-center rounded-full border border-light-400 bg-light text-dark/90 shadow-xl transition duration-300 hover:bg-light-200 hover:text-brand-dark focus:outline-none rtl:rotate-180 xl:h-9 xl:w-9"
          >
            <ChevronRight className="h-4 w-4 xl:h-[18px] xl:w-[18px]" />
          </div>
        </div>
      </div>
      <div className="flex-shrink-0">
        <Swiper
          id="productGalleryThumbs"
          freeMode={true}
          modules={[Navigation, Thumbs, FreeMode]}
          observer={true}
          slidesPerView={4}
          onSwiper={setThumbsSwiper}
          observeParents={true}
          watchSlidesProgress={true}
        >
          {youtubeVideoIds?.map((item, idx) => (
            <SwiperSlide
              key={`product-thumb-video-${idx}`}
              className="relative flex aspect-[16/9] items-center justify-center bg-light-200 dark:bg-dark-200"
            >
              <ImageWithFallback
                fill
                objectFit="cover"
                src={getThumbnailUrl(item) ?? placeholder}
                alt={`Product thumb video ${item}`}
                className="object-cover"
              />
            </SwiperSlide>
          ))}
          {gallery?.map((item: any, idx: number) => (
            <SwiperSlide
              key={`product-thumb-gallery-${idx}`}
              className="relative flex aspect-[16/9] cursor-pointer items-center justify-center border border-light-500 transition hover:opacity-75 dark:border-dark-500"
            >
              <ImageWithFallback
                fill
                objectFit="cover"
                src={item?.thumbnail ?? placeholder}
                alt={`Product thumb gallery ${idx}`}
                className="object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}
