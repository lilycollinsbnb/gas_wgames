import { useRouter } from 'next/router'
import routes from '@/config/routes'
import Button from '@/components/ui/button'
import SearchButton from '@/components/search/search-button'
import CartButton from '@/components/cart/cart-button'
import Hamburger from '@/components/ui/hamburger'
import { useDrawer } from '@/components/drawer-views/context'
import { CategoriesIcon } from '@/components/icons/categories-icon'

export default function BottomNavigation() {
  const router = useRouter()
  const { openDrawer } = useDrawer()

  return (
    <nav className="font-body sticky bottom-0 z-30 grid h-14 w-full auto-cols-fr grid-flow-col items-center bg-light py-2 text-center shadow-bottom-nav dark:bg-dark-250 sm:hidden">
      <Button
        variant="icon"
        aria-label="Asset Categories"
        onClick={() => router.push(routes.categories)}
      >
        <CategoriesIcon className="h-8 w-8" />
      </Button>
      <SearchButton />
      {router.asPath !== routes.checkout && <CartButton className="mt-1.5" />}
      <Hamburger onClick={() => openDrawer('MOBILE_MENU')} />
    </nav>
  )
}
