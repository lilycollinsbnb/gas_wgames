import { DefaultSeo as NextDefaultSeo } from 'next-seo'

export const seoSettings = {
  siteName: 'Assets 4 Godot',
  siteName2: 'Assets for Godot',
  mainPageTitle: 'Premium quality Godot assets marketplace',
  description:
    'High-quality, premium game assets for Godot Engine. Regularly updated marketplace supporting game development, stable partnerships for individual creators and businesses.',
  siteUrl: 'https://assets4godot.com',
  twitter: {
    cardType: 'summary'
  },
  imageAlt:
    'Premium-quality, game assets for Godot Engine including 3D models, textures, and scripts. Suitable for both individual creators and businesses.'
}

const DefaultSeo = () => {
  return (
    <NextDefaultSeo
      additionalMetaTags={[
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1 maximum-scale=1'
        },
        {
          name: 'apple-mobile-web-app-capable',
          content: 'yes'
        },
        {
          name: 'theme-color',
          content: '#ffffff'
        }
      ]}
      additionalLinkTags={[
        {
          rel: 'apple-touch-icon',
          href: '/icons/apple-icon-180.png'
        },
        // {
        //   rel: 'manifest',
        //   href: '/manifest.json'
        // },
        {
          rel: 'icon',
          href: '/favicon.ico'
        }
      ]}
      defaultTitle={`${seoSettings.siteName} | ${seoSettings.mainPageTitle}`}
      description={seoSettings.description}
      openGraph={{
        title: seoSettings.mainPageTitle,
        description: seoSettings.description,
        type: 'website',
        locale: 'en_US',
        site_name: seoSettings.siteName,
        images: [
          {
            url: `${seoSettings.siteUrl}/images/og-image.png`,
            width: 1200,
            height: 630,
            alt: seoSettings.imageAlt
          }
        ]
      }}
      twitter={{
        // handle: settings?.seo?.twitterHandle,
        site: seoSettings?.siteName,
        cardType: seoSettings.twitter.cardType
      }}
    />
  )
}

export default DefaultSeo
