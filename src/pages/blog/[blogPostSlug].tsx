import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import type { BlogPost, NextPageWithLayout } from '@/types'
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType
} from 'next'
import client from '@/data/client'
import Layout from '@/layouts/_layout'
import { dehydrate, QueryClient } from 'react-query'
import invariant from 'tiny-invariant'
import DynamicBreadcrumbs from '@/components/ui/links/breadcrumbs'
import { useRouter } from 'next/router'
import placeholder from '@/assets/images/placeholders/product.svg'
import Seo from '@/layouts/_seo'
import MarkdownRenderer from '@/components/ui/markdown-renderer'
import dayjs from 'dayjs'
import ActiveLink from '@/components/ui/links/active-link'
import routes from '@/config/routes'
import ImageWithFallback from '@/components/ui/image-with-fallback'

type ParsedQueryParams = {
  blogPostSlug: string
}

export const getStaticPaths: GetStaticPaths<ParsedQueryParams> = async ({
  locales
}) => {
  invariant(locales, 'locales is not defined')
  const { data } = await client.blog.all({ limit: 100 })
  const paths = data?.flatMap((blogPost) =>
    locales?.map((locale) => ({
      params: { blogPostSlug: blogPost.slug },
      locale
    }))
  )

  return {
    paths,
    fallback: 'blocking'
  }
}

type PageProps = {
  blogPost: BlogPost
}

export const getStaticProps: GetStaticProps<
  PageProps,
  ParsedQueryParams
> = async ({ params, locale }) => {
  const queryClient = new QueryClient()
  const { blogPostSlug } = params!
  try {
    const [blogPost] = await Promise.all([
      client.blog.get({ slug: blogPostSlug, language: locale })
    ])

    return {
      props: {
        blogPost,
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
        ...(await serverSideTranslations(locale!, ['common']))
      },
      revalidate: 15 * 60 // In seconds
    }
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return {
      notFound: true,
      revalidate: 15 * 60 // In seconds
    }
  }
}

const BlogPostPage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ blogPost }) => {
  const { t } = useTranslation('common')
  const { asPath } = useRouter()
  const createdAt = dayjs(blogPost.created_at).format('YYYY-MM-DD')
  const updatedAt = dayjs(blogPost.updated_at).format('YYYY-MM-DD HH:mm:ss')

  return (
    <>
      <Seo
        title={`${blogPost.title} | Blog`}
        description={blogPost.description}
        url={routes.blogPostUrl(blogPost.slug)}
        canonical={routes.blogPostUrl(blogPost.slug)}
        images={[
          {
            url: blogPost?.image?.original,
            width: 800,
            height: 600,
            alt: `${blogPost.title}`
          }
        ]}
      />
      <div className="mt-5 px-4">
        <DynamicBreadcrumbs path={asPath} />
      </div>
      <div className="blog-post mx-auto flex h-full w-full max-w-screen-xl flex-col p-4 sm:p-6">
        <div className="last-updated">
          ({t('last-updated')}&nbsp;{updatedAt})&nbsp;
        </div>
        <div className="mb-8">
          <h1 className="blog-title">{blogPost.title}</h1>
          <div className="blog-post-header">
            <ActiveLink
              className="blog-post-author text-sm font-medium transition-colors hover:text-blue-600"
              href={routes.shopUrl(blogPost.shop_slug)}
            >
              {blogPost.user_name}
            </ActiveLink>
            &nbsp;
            {createdAt}
            &nbsp;
          </div>
        </div>
        {blogPost && (
          <div className="relative mb-5 aspect-[16/9]">
            <ImageWithFallback
              src={blogPost?.image?.original ?? placeholder} // Fallback image if blogPost image is not available
              alt={blogPost?.title || 'Blog post image'}
              quality={100}
              fill
              objectFit="cover"
              className="rounded-lg shadow-lg"
            />
          </div>
        )}
        <MarkdownRenderer
          allowHtml={true}
          sanitizeHtml={true}
          enableMarkdownPreprocessing={true}
          content={blogPost.content ?? ''}
        />
      </div>
    </>
  )
}

BlogPostPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default BlogPostPage
