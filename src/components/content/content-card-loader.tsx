import ContentLoader from 'react-content-loader'
import { useIsDarkMode } from '@/lib/hooks/use-is-dark-mode'
import { useIsMounted } from '@/lib/hooks/use-is-mounted'

export default function ContentCardLoader(props: any) {
  const isMounted = useIsMounted()
  const { isDarkMode } = useIsDarkMode()

  return (
    <ContentLoader
      speed={2}
      width="100%"
      height="100%"
      viewBox="0 0 300 450" // Adjusted for longer image and card layout
      backgroundColor={isMounted && isDarkMode ? '#505050' : '#d0d0d0'}
      foregroundColor={isMounted && isDarkMode ? '#606060' : '#c0c0c0'}
      {...props}
    >
      {/* Image Skeleton */}
      <rect x="0" y="0" rx="8" ry="8" width="100%" height="70%" />

      {/* Title Skeleton */}
      <rect x="16" y="320" rx="4" ry="4" width="80%" height="20" />

      {/* Description Skeleton */}
      <rect x="16" y="360" rx="4" ry="4" width="40%" height="18" />

      {/* Footer Skeleton */}
      <rect x="16" y="390" rx="4" ry="4" width="60%" height="18" />
    </ContentLoader>
  )
}
