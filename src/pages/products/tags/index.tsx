import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import AssetGrid from '@/components/product/grid';
import client from '@/data/client';
import { API_ENDPOINTS } from '@/data/client/endpoints';
import { useProducts } from '@/data/product';
import Layout from '@/layouts/_layout';
import { dehydrate, QueryClient } from 'react-query';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextPageWithLayout } from '@/types';
import { createSlug } from '@/lib/create-slug';
import { debounce } from 'lodash';
import { SimpleSearchIcon } from '@/components/icons/simple-search-icon';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const queryClient = new QueryClient();
  const searchQuery = ''; // Default search query

  try {
    const formattedOptions = {
      search: searchQuery,
      language: locale,
    };

    await queryClient.prefetchInfiniteQuery(
      [API_ENDPOINTS.PRODUCTS_PUBLIC, formattedOptions],
      ({ queryKey, pageParam }) => client.assets.all(Object.assign({}, queryKey[1], pageParam))
    );

    return {
      props: {
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
        ...(await serverSideTranslations(locale!, ['common'])),
      },
      revalidate: 30 * 60, // Revalidate every 30 minutes
    };
  } catch (error) {
    return {
      notFound: true,
      revalidate: 5 * 60,
    };
  }
};

const IndexPage: NextPageWithLayout<InferGetStaticPropsType<typeof getStaticProps>> = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { query } = router;

  const [search, setSearch] = useState<string>(''); // Track user input
  const searchAsSlug = query.slug ?? ''; // Default to query slug
  const queryOptions = searchAsSlug ? { tags: searchAsSlug } : {}; // Use slug as query if available

  const { products, paginatorInfo, isLoading, loadMore, hasNextPage, isLoadingMore } = useProducts(
    queryOptions
  );

  // Update the URL with the new slug
  const updateSlugInUrl = (slug: string) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...query, slug }, // Update slug in query params
      },
      undefined,
      { shallow: true } // Shallow routing to avoid full page reload
    );
  };

  // Debounced function to handle updating slug in the URL
  const debouncedUpdateSlug = useMemo(
    () =>
      debounce((term: string) => {
        const transformedSlug = createSlug(term); // Transform the search term into a slug
        updateSlugInUrl(transformedSlug);
      }, 500), // 500ms debounce delay
    [] // Empty dependency array ensures the function is created once
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    setSearch(newSearch); // Update local state with the input
    debouncedUpdateSlug(newSearch); // Trigger the debounced URL update
  };

  // Submit search manually (e.g., when Enter is pressed)
  const handleSearchSubmit = () => {
    const transformedSlug = createSlug(search); // Transform the search term to slug
    router.push({
      pathname: '/',
      query: { slug: transformedSlug }, // Update query parameter with the slug
    });
  };

  useEffect(() => {
    if (query.slug) {
      setSearch(query.slug as string);
    }
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-between gap-1.5 px-4 pt-5 xs:flex-row md:px-6 md:pt-6 lg:px-7 3xl:px-8">
      <div className="relative mt-3 w-full max-w-xs sm:mt-0">
          <SimpleSearchIcon className="absolute left-1 top-1/2 -mt-2 h-4 w-4" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={handleSearchChange} // Trigger debounce on input change
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchSubmit(); // Trigger search on Enter
              }
            }}
            placeholder={t('text-placeholder-search-by-tag')}
            className="border-dark-30 h-11 w-full border-0 border-b border-b-light-600 bg-transparent pl-8 text-13px outline-none focus:border-b-light-800 focus:ring-0 dark:border-b-dark-400 dark:focus:border-b-dark-500"
          />
        </div>
        <div>
            {t('text-total')} {paginatorInfo?.total} {t('text-product-found')}
        </div>
      </div>

      <div>
          <>
            <AssetGrid
              products={products}
              onLoadMore={loadMore}
              hasNextPage={hasNextPage}
              isLoadingMore={isLoadingMore}
              isLoading={isLoading}
            />
          </>
      </div>
    </>
  );
};

IndexPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default IndexPage;
