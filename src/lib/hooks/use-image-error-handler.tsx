import { useEffect } from 'react'

const useImageErrorHandler = () => {
  useEffect(() => {
    const failedImages = new Set<string>()

    const handleImageError = (img: HTMLImageElement) => {
      if (failedImages.has(img.src)) {
        return
      }

      img.onerror = () => {
        const src = img.src
        const originalS3Url = new URL(src).searchParams.get('url')

        if (originalS3Url && originalS3Url !== src) {
          img.src = originalS3Url
          if (img.srcset) {
            img.srcset = ''
          }

          failedImages.add(originalS3Url)
        } else {
          failedImages.add(src)
        }
      }
    }

    const observeImages = () => {
      const images = document.querySelectorAll('img')
      images.forEach(handleImageError)
    }

    const observer = new MutationObserver(() => {
      observeImages()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    observeImages()

    return () => {
      observer.disconnect()
    }
  }, [])
}

export default useImageErrorHandler
