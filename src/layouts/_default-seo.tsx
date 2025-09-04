import { DefaultSeo as NextDefaultSeo } from 'next-seo'

export const seoSettings = {
  siteName: 'Games 4 Godot',
  siteName2: 'Games for Godot',
  mainPageTitle: 'Games 4 Godot – Discover and share Godot Engine games',
  description:
    'Games 4 Godot is a dedicated marketplace and community hub for Godot Engine games. Explore, play, and support premium and indie titles built with Godot.',
  siteUrl: 'https://games4godot.com',
  twitter: {
    cardType: 'summary'
  },
  imageAlt:
    'Games 4 Godot – discover, play, and support premium and indie games built with the Godot Engine.'
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
