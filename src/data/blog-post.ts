import { BlogPost, BlogPostPaginator, BlogPostQueryOptions } from '@/types';
import { useRouter } from 'next/router';
import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useQuery,
} from 'react-query';
import { API_ENDPOINTS } from './client/endpoints';
import client from './client';

export function useBlogPost(slug: string) {
  const { locale: language } = useRouter();

  const { data, isLoading, error } = useQuery<BlogPost, Error>(
    [API_ENDPOINTS.BLOG, { slug, language }],
    () => client.blog.get({ slug, language })
  );
  return {
    blogPost: data,
    isLoading,
    error,
  };
}

export function useBlogPosts(
  options?: Partial<BlogPostQueryOptions>,
  config?: UseInfiniteQueryOptions<BlogPostPaginator, Error>
) {
  const { locale } = useRouter();

  const formattedOptions = {
    ...options,
    language: locale,
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<BlogPostPaginator, Error>(
    [API_ENDPOINTS.BLOG, formattedOptions],
    ({ queryKey, pageParam }) => {
      return client.blog.all(Object.assign({}, queryKey[1], pageParam));
    },
    {
      ...config,
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
    }
  );

  function handleLoadMore() {
    fetchNextPage();
  }

  return {
    blogPosts: data?.pages.flatMap((page) => page.data) ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? data?.pages[data.pages.length - 1]
      : null,
    isLoading,
    error,
    hasNextPage,
    isFetching,
    isLoadingMore: isFetchingNextPage,
    loadMore: handleLoadMore,
  };
}
