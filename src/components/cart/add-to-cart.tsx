import { useState, useEffect } from 'react'
import cn from 'classnames'
import toast from 'react-hot-toast'
import Button from '@/components/ui/button'
import { useCart } from '@/components/cart/lib/cart.context'
import usePrice from '@/lib/hooks/use-price'
import {
  ItemType,
  User,
  type Asset,
  type AddToCartItem,
  TargetPlatform
} from '@/types'
import { generateCartItem } from './lib/generate-cart-item'
import { useTranslation } from 'next-i18next'
import { useMe } from '@/data/user'
import { useDrawer } from '@/components/drawer-views/context'
import { useRouter } from 'next/router'
import { useMutation } from 'react-query'
import client from '@/data/client'
import { download } from '@/lib/download-asset'
import { useModalAction } from '@/components/modal-views/context'

interface Props {
  item: AddToCartItem
  className?: string
  toastClassName?: string
  withPrice?: boolean
  nobutton?: boolean
  emoji?: boolean
}

function handleIsPurchased(item: AddToCartItem, me?: User) {
  switch (item.item_type) {
    case ItemType.Asset:
      return me?.bought_assets.includes(item.id)
    case ItemType.Game:
      return me?.bought_games.includes(item.id)
    default:
      return false
  }
}

export default function AddToCart({
  item,
  className,
  toastClassName,
  withPrice = true,
  nobutton = false,
  emoji = false
}: Props) {
  const { openDrawer } = useDrawer()
  const { t } = useTranslation('common')
  const { addItemToCart, updateCartLanguage, language, isInCart } = useCart()
  const [addToCartLoader, setAddToCartLoader] = useState(false)
  const [cartingSuccess, setCartingSuccess] = useState(false)
  const [showEmoji, setShowEmoji] = useState(true)
  const priceValue = item?.sale_price ? item?.sale_price : item?.price
  const { price } = usePrice({
    amount: priceValue,
    baseAmount: item?.price
  })
  const isFree = price ? priceValue === 0 : false
  const { me } = useMe()
  const { mutate: downloadAsset } = useMutation(
    client.orders.generateDownloadAssetLink,
    {
      onSuccess: (data) => {
        download(data)
      }
    }
  )

  const { closeModal, openModal } = useModalAction()

  function handleGenerateDownloadLink(item: AddToCartItem) {
    switch (item.item_type) {
      case ItemType.Asset:
        return downloadAsset({ id: item.id })
      case ItemType.Game:
        return openModal('DOWNLOAD_GAME_MODAL', {
          game_id: item.id,
          builds: item.builds || []
        })
      default:
        return
    }
  }

  useEffect(() => {
    setShowEmoji(!(isInCart(item.id) || me?.bought_assets.includes(item.id)))
  }, [isInCart(item.id), me?.bought_assets])

  function handleAddToCart() {
    setAddToCartLoader(true)
    setTimeout(() => {
      setAddToCartLoader(false)
      addSuccessfully()
    }, 650)
  }

  function goToCart() {
    closeModal() // close popup
    setTimeout(() => {
      openDrawer('CART_VIEW')
    }, 200)
  }

  function addSuccessfully() {
    // TODO fix when languages will be implemented
    // if (item?.language !== language) {
    //   updateCartLanguage(item?.language)
    // }
    setCartingSuccess(true)
    addItemToCart(generateCartItem(item), 1)
    toast.success(<b>{t('text-add-to-cart-message')}</b>, {
      className: toastClassName
    })
    setTimeout(() => {
      setCartingSuccess(false)
    }, 800)
  }

  const isItemAlreadyPurchased = handleIsPurchased(item, me)
  const isMine = me?.editable_assets.includes(item.id) ?? false
  const isAssetIsInCart = isInCart(item.id)
  const canAddToCart = !isItemAlreadyPurchased && !isAssetIsInCart

  const handleOnClick = () => {
    if (isMine) {
      return
    }
    if (addToCartLoader) {
      return
    }
    if (isAssetIsInCart) {
      goToCart()
      return
    }
    if (isItemAlreadyPurchased) {
      handleGenerateDownloadLink(item)
      return
    }
    handleAddToCart()
    setShowEmoji(false)
  }

  function getAddToCartText() {
    if (!item.is_foss && !isFree) {
      return t('text-add-to-cart')
    } else if (item.is_foss && isFree) {
      return t('text-add-to-account')
    } else if (item.is_foss && !isFree) {
      return t('text-support-creator')
    } else {
      return t('text-add-to-cart') // fallback, in case a new condition arises
    }
  }

  function getPriceText() {
    if (withPrice && !isFree) {
      return `${price} ( + VAT )`
    } else if (withPrice && isFree) {
      return `( ${t('text-free')} )`
    } else if (!withPrice) {
      return ''
    } else {
      return `${price} ( + VAT )` // fallback, in case a new condition arises
    }
  }

  return (
    <Button
      title="addToCart"
      id={'add-to-cart-' + item.slug}
      onClick={handleOnClick}
      isLoading={addToCartLoader}
      className={cn(
        !nobutton && 'relative',
        !nobutton &&
          (cartingSuccess
            ? 'is-carting pointer-events-none cursor-not-allowed'
            : 'pointer-events-auto cursor-pointer'),
        className
      )}
      disabled={addToCartLoader || isMine}
      style={nobutton ? { all: 'unset', cursor: 'pointer' } : {}}
    >
      {canAddToCart && showEmoji && (
        <div
          className={nobutton ? 'hover:text-brand' : ''}
          aria-label={getAddToCartText()}
        >
          {emoji ? '🛒' : `${getAddToCartText()} ${getPriceText()}`}
        </div>
      )}
      {!canAddToCart &&
        (isItemAlreadyPurchased ? (
          <div
            className={nobutton ? 'hover:text-brand' : ''}
            aria-label={t('text-download')}
          >
            {emoji ? '👜' : t('text-download')}
          </div>
        ) : (
          <div
            className={nobutton ? 'hover:text-brand' : ''}
            aria-label={t('text-in-cart')}
          >
            {emoji ? '👜' : t('text-in-cart')}
          </div>
        ))}
      {!nobutton &&
        !isAssetIsInCart &&
        !isItemAlreadyPurchased &&
        showEmoji && (
          <svg
            viewBox="0 0 37 37"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute bottom-auto right-3 top-auto h-auto w-5 xs:right-4 xs:w-6"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeMiterlimit="10"
              strokeWidth="2.3"
              d="M30.5 6.5h0c6.6 6.6 6.6 17.4 0 24h0c-6.6 6.6-17.4 6.6-24 0h0c-6.6-6.6-6.6-17.4 0-24h0c6.6-6.7 17.4-6.7 24 0z"
              className="circle path"
            />
            <path
              fill="none"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeMiterlimit="10"
              strokeWidth="2.3"
              d="M11.6 20L15.9 24.2 26.4 13.8"
              className="tick path"
            />
          </svg>
        )}
    </Button>
  )
}
