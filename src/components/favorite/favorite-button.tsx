import { useModalAction } from '@/components/modal-views/context';
import { useInWishlist, useToggleWishlist } from '@/data/wishlist';
import { useMe } from '@/data/user';
import classNames from 'classnames';
import { HeartFillIcon } from '@/components/icons/heart-fill';
import { HeartOutlineIcon } from '@/components/icons/heart-outline';
import { LoaderIcon } from 'react-hot-toast';

export default function FavoriteButton({
  productId,
  className,
  id
}: {
  productId: string;
  variationId?: string;
  className?: string;
  id: string;
}) {
  const { me, isAuthorized } = useMe();
  const { toggleWishlist, isLoading: adding } = useToggleWishlist(productId);
  const { inWishlist, isLoading: checking } = useInWishlist({
    enabled: isAuthorized,
    product_id: productId,
  });

  const { openModal } = useModalAction();

  function toggle() {
    if (!isAuthorized) {
      openModal('LOGIN_VIEW');
      return;
    }
    toggleWishlist({ product_id: productId });
  }

  const isLoading = adding || checking;
  if (isLoading) {
    return (
      <div
        className={classNames(
          'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center ',
          className
        )}
      >
        <LoaderIcon className="flex h-5 w-5" />
      </div>
    );
  }
  return (
    <>
      {me?.bought_assets && me.bought_assets.includes(productId) ? (
        <div></div>
      ) : (
        <button
          type="button"
          id={id}
          className={classNames(
            'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center transition-colors',
            {
              '!border-brand': inWishlist,
            },
            className
          )}
          onClick={toggle}
        >
          {inWishlist ? (
            <HeartFillIcon className="h-5 w-5 text-brand" />
          ) : (
            <HeartOutlineIcon className="h-5 w-5" />
          )}
        </button>
      )}
    </>
  );
}
