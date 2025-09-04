import { useProducts } from '@/data/product';
import AssetGrid from '@/components/product/grid';

export default function SearchResults({ searchText }: { searchText: string }) {
  const { products, loadMore, hasNextPage, isLoadingMore, isLoading } =
    useProducts(
      {
        name: searchText,
      }
      // {
      //   enabled: Boolean(searchText),
      // }
    );
  return (
    <AssetGrid
      products={products}
      onLoadMore={loadMore}
      hasNextPage={hasNextPage}
      isLoadingMore={isLoadingMore}
      isLoading={isLoading}
    />
  );
}
