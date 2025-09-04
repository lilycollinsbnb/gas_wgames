import cn from 'classnames'
import AnchorLink from '@/components/ui/links/anchor-link'
import routes from '@/config/routes'
import { useIsMounted } from '@/lib/hooks/use-is-mounted'
import { useIsDarkMode } from '@/lib/hooks/use-is-dark-mode'
import { siteSettings } from '@/data/static/site-settings'
import { useSettings } from '@/data/settings'
import { useRouter } from 'next/router'
import ImageWithFallback from './image-with-fallback'

export default function Logo({
  className = 'w-20',
  ...props
}: React.AnchorHTMLAttributes<{}>) {
  const isMounted = useIsMounted()
  const { isDarkMode } = useIsDarkMode()
  const { lightLogo, darkLogo } = siteSettings
  const { settings }: any = useSettings()
  const { locale } = useRouter()

  return (
    <AnchorLink
      href={routes.home}
      className={cn(
        'relative flex items-center text-dark focus:outline-none dark:text-light',
        className
      )}
      {...props}
    >
      <span
        className="relative overflow-hidden"
        style={{
          width: siteSettings?.width,
          height: siteSettings?.height
        }}
      >
        {isMounted && isDarkMode && (
          <ImageWithFallback
            // src={settings?.dark_logo?.original ?? darkLogo}
            src={darkLogo}
            fill
            loading="eager"
            alt={settings?.siteTitle ?? 'Dark Logo'}
            className="object-contain"
          />
        )}
        {isMounted && !isDarkMode && (
          <ImageWithFallback
            // src={settings?.logo?.original ?? lightLogo}
            src={lightLogo}
            fill
            loading="eager"
            alt={settings?.siteTitle ?? 'Light Logo'}
            className="object-contain"
          />
        )}
      </span>
    </AnchorLink>
  )
}
