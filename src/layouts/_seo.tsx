import { NextSeo, NextSeoProps } from 'next-seo'
import { OpenGraphMedia } from 'next-seo/lib/types'
interface SeoProps extends NextSeoProps {
  url: string
  images?: ReadonlyArray<OpenGraphMedia>
}
const Seo = ({
  title,
  description,
  url,
  images,
  canonical,
  ...props
}: SeoProps) => {
  return (
    <NextSeo
      title={title}
      description={description}
      openGraph={{
        url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}${url}`,
        title,
        description,
        images
      }}
      canonical={`${process.env.NEXT_PUBLIC_WEBSITE_URL}${canonical}`}
      {...props}
    />
  )
}

export default Seo
