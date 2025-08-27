import { TagPaginator, TagQueryOptions } from '@/types';
import { useRouter } from 'next/router';
import { useInfiniteQuery } from 'react-query';
import { API_ENDPOINTS } from './client/endpoints';
import client from './client';

export function useTags(options?: TagQueryOptions) {
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
    isFetchingNextPage,
  } = useInfiniteQuery<TagPaginator, Error>(
    [API_ENDPOINTS.TAGS, formattedOptions],
    ({ queryKey, pageParam }) =>
      client.tags.all(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
    }
  );
  function handleLoadMore() {
    fetchNextPage();
  }
  return {
    tags: data?.pages.flatMap((page) => page.data) ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? data?.pages[data.pages.length - 1]
      : null,
    hasNextPage,
    isLoadingMore: isFetchingNextPage,
    isLoading,
    error,
    loadMore: handleLoadMore,
  };
}
