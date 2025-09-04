import cn from 'classnames'
import routes from '@/config/routes'
import Logo from '@/components/ui/logo'
import ActiveLink from '@/components/ui/links/active-link'
import { DiscoverIcon } from '@/components/icons/discover-icon'
import { HelpIcon } from '@/components/icons/help-icon'
import { AssetsIcon } from '@/components/icons/assets-icon'
import { SettingIcon } from '@/components/icons/setting-icon'
import { CloseIcon } from '@/components/icons/close-icon'
import { useDrawer } from '@/components/drawer-views/context'
import { PeopleIcon } from '@/components/icons/people-icon'
import { ContactIcon } from '@/components/icons/contact-icon'
import Scrollbar from '@/components/ui/scrollbar'
import Copyright from '@/layouts/_copyright'
import { useTranslation } from 'next-i18next'
import { BlogArticleIcon } from '@/components/icons/article-icon'
import { CategoriesIcon } from '@/components/icons/categories-icon'
import { GameDiscIcon } from '@/components/icons/game-icon'
import { TrainingIcon } from '@/components/icons/training-icon'
import { OutsourcingIcon } from '@/components/icons/outsourcing-icon'
import { NavGroup } from './_nav-group'
import { ServicesIcon } from '@/components/icons/services-icons'
import { NavLink } from './_nav-link'

export function Sidebar({
  isCollapse,
  className = 'hidden sm:flex fixed bottom-0 z-20 pt-[82px]'
}: {
  isCollapse?: boolean
  className?: string
}) {
  const { t } = useTranslation('common')

  return (
    <aside
      className={cn(
        'h-full flex-col justify-between overflow-y-auto border-r border-light-400 bg-light-100 text-dark-900 dark:border-0 dark:bg-dark-200',
        isCollapse ? 'sm:w-[74px]' : 'sm:w-[190px] lg:w-[200px] xl:w-60',
        className
      )}
    >
      <Scrollbar className="relative h-full w-full">
        <div className="flex h-full w-full flex-col">
          <nav className="flex flex-col">
            <NavGroup
              title={t('text-assets')}
              hint="assets"
              href={routes.home}
              icon={<AssetsIcon className="h-[18px] w-[18px] text-current" />}
              isCollapse={isCollapse}
            >
              <NavLink
                title={t('text-explore')}
                hint="explore"
                href={routes.explore}
                isCollapse={false}
                icon={
                  <DiscoverIcon className="h-[18px] w-[18px] text-current" />
                }
                nested={true}
              />
              <NavLink
                title={t('text-popular-products')}
                hint="popular-products"
                href={routes.popularAssets}
                isCollapse={false}
                icon={<AssetsIcon className="h-4 w-4 text-current" />}
                nested={true}
              />
              <NavLink
                title={t('text-top-authors')}
                hint="top-authors"
                href={routes.authors}
                isCollapse={false}
                icon={<PeopleIcon className="h-[18px] w-[18px] text-current" />}
                nested={true}
              />
              <NavLink
                title={t('text-categories')}
                hint="categories"
                href={routes.categories}
                isCollapse={false}
                icon={<CategoriesIcon className="h-4 w-4 text-current" />}
                nested={true}
              />
            </NavGroup>

            <NavLink
              title={t('text-games')}
              hint="games"
              href={routes.games}
              isCollapse={isCollapse}
              icon={<GameDiscIcon className="h-4 w-4 text-current" />}
            />

            <NavGroup
              title={t('text-services')}
              hint="services"
              href={routes.services}
              icon={<ServicesIcon className="h-[18px] w-[18px] text-current" />}
              isCollapse={isCollapse}
            >
              <NavLink
                title={t('text-trainings')}
                hint={'trainings'}
                href={routes.trainings}
                isCollapse={false}
                icon={
                  <TrainingIcon className="h-[18px] w-[18px] text-current" />
                }
                nested={true}
              />
              <NavLink
                title={t('text-outsourcing')}
                hint="outsourcing"
                href={routes.outsourcing}
                isCollapse={false}
                icon={
                  <OutsourcingIcon className="h-[18px] w-[18px] text-current" />
                }
                nested={true}
              />
            </NavGroup>
            <NavLink
              title={t('text-blog')}
              hint="blog"
              href={routes.blog}
              isCollapse={isCollapse}
              icon={<BlogArticleIcon className="h-4 w-4 text-current" />}
            />
            <NavLink
              title={t('text-contact')}
              hint="contact"
              href={routes.contact}
              isCollapse={isCollapse}
              icon={
                <ContactIcon className="h-[18px] w-[18px] text-current" />
              }
            />
          </nav>

          <nav className="mt-auto flex flex-col pb-4">
            <NavLink
              title={t('text-settings')}
              hint="settings"
              href={routes.profile}
              isCollapse={isCollapse}
              icon={<SettingIcon className="h-[18px] w-[18px] text-current" />}
            />
            <NavLink
              title={t('text-help-page-title')}
              hint="help"
              href={routes.help}
              isCollapse={isCollapse}
              icon={<HelpIcon className="h-[18px] w-[18px] text-current" />}
            />
          </nav>
        </div>
      </Scrollbar>

      <footer
        className={cn(
          'flex-col border-light-400 px-7 pb-4 pt-3 dark:border-dark-400',
          isCollapse ? 'flex xl:hidden' : 'hidden xl:flex'
        )}
      >
        <nav className="flex flex-col pb-1.5 text-10px font-medium tracking-[0.2px]">
          <ActiveLink
            id="cookie-policy"
            title="cookie-policy"
            href={routes.cookiePolicy}
            className="block pb-2.5 text-dark-700 hover:text-dark-100 dark:text-light-500 dark:hover:text-mint"
          >
            {t('text-cookie-policy-page-title')}
          </ActiveLink>
          <ActiveLink
            id="privacy"
            title="privacy"
            href={routes.privacy}
            className="block pb-2.5 text-dark-700 hover:text-dark-100 dark:text-light-500 dark:hover:text-mint"
          >
            {t('text-privacy-page-title')}
          </ActiveLink>
          <ActiveLink
            id="terms"
            title="terms"
            href={routes.terms}
            className="block pb-2.5 text-dark-700 hover:text-dark-100 dark:text-light-500 dark:hover:text-mint"
          >
            {t('text-terms-page-title')}
          </ActiveLink>
        </nav>
        <Copyright className="text-xs font-medium text-dark-800/80 dark:text-dark-700" />
      </footer>
    </aside>
  )
}

export default function SidebarDrawerView() {
  const { closeDrawer } = useDrawer()
  const { t } = useTranslation()
  return (
    <>
      <div className="flex h-[70px] items-center justify-between px-5 py-2 xs:px-7">
        <Logo />
        <div className="ml-3 flex h-7 items-center">
          <button
            type="button"
            className="-m-2 p-2 text-dark-900 outline-none transition-all hover:text-dark dark:text-dark-800 hover:dark:text-light-200"
            onClick={closeDrawer}
          >
            <span className="sr-only">{t('text-close-panel')}</span>
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-70px)]">
        <Sidebar isCollapse={false} className="flex text-13px" />
      </div>
    </>
  )
}
