import dayjs from 'dayjs'
import { UpdateIcon } from '@/components/icons/update-icon'
import { CalenderIcon } from '@/components/icons/calendar-icon'
import { LabelIcon } from '@/components/icons/label-icon'
import AnchorLink from '@/components/ui/links/anchor-link'
import classNames from 'classnames'
import { Category, CustomTag, License, Tag } from '@/types'
import routes from '@/config/routes'
import { useTranslation } from 'next-i18next'
import { SettingIcon } from '../icons/setting-icon'
import { CategoriesIcon } from '../icons/categories-icon'
import { PencilIcon } from '../icons/pencil-icon'

interface Props {
  className?: string
  updated_at: string
  created_at: string
  tags: Tag[]
  customTags: CustomTag[]
  categories: Category[]
  godotVersion?: string
  license?: License
}

export function getTagRedirectionUrl(tagsSlug: string) {
  return {
    pathname: '/products/tags',
    query: { slug: tagsSlug }
  }
}

export function getLicenseRedirectUrl(licenseId?: string) {
  if (licenseId) {
    return `${routes.license}?id=${licenseId}`
  }

  return routes.terms
}

export default function ProductInformation({
  className,
  updated_at,
  created_at,
  tags,
  customTags,
  categories,
  godotVersion,
  license
}: Props) {
  const { t } = useTranslation('common')

  return (
    <div className={classNames('space-y-4 text-13px', className)}>
      <div className="flex items-start text-dark dark:text-light mt-10">
        <strong className="flex w-36 flex-shrink-0 items-center font-normal text-dark-600 dark:text-light-600">
          <span className="w-8 flex-shrink-0 text-dark-900 dark:text-light-900">
            <SettingIcon className="h-[18px] w-[18px]" />
          </span>
          {t('text-godot-version')}:
        </strong>
        <span className="font-medium">
          {godotVersion ? godotVersion : t('text-any-godot-version')}
        </span>
      </div>
      <div className="flex items-start text-dark dark:text-light">
        <strong className="flex w-36 flex-shrink-0 items-center font-normal text-dark-600 dark:text-light-600">
          <span className="w-8 flex-shrink-0 text-dark-900 dark:text-light-900">
            <UpdateIcon className="h-[18px] w-[18px]" />
          </span>
          {t('text-last-update')}:
        </strong>
        <span className="font-medium">
          {dayjs(updated_at).format('DD.MM.YYYY')}
        </span>
      </div>
      <div className="flex items-start text-dark dark:text-light">
        <strong className="flex w-36 flex-shrink-0 items-center font-normal text-dark-600 dark:text-light-600">
          <span className="w-8 flex-shrink-0 text-dark-900 dark:text-light-900">
            <CalenderIcon className="h-[18px] w-[18px]" />
          </span>
          {t('text-published')}:
        </strong>
        <span className="font-medium">
          {dayjs(created_at).format('DD.MM.YYYY')}
        </span>
      </div>
      {categories && !!categories?.length && (
        <div className="flex items-start text-dark dark:text-light">
          <strong className="flex w-36 flex-shrink-0 items-center pt-0.5 font-normal text-dark-600 dark:text-light-600">
            <span className="w-8 flex-shrink-0 text-dark-900 dark:text-light-900">
              <CategoriesIcon className="h-5 w-5" />
            </span>
            {t('text-categories')}:
          </strong>
          <div className="flex flex-wrap gap-2">
            {categories?.map((category: Category) => (
              <AnchorLink
                key={category.id}
                href={category?.url ?? routes.categories}
                className="inline-flex items-center justify-center rounded border border-light-600 px-2 py-0.5 font-medium text-light-base transition-all hover:bg-light-200 hover:text-dark-300 dark:border-dark-500 dark:text-light-600 dark:hover:bg-dark-400 hover:dark:text-light"
              >
                {category.name}
              </AnchorLink>
            ))}
          </div>
        </div>
      )}
      {!!tags?.length && (
        <div className="flex items-start text-dark dark:text-light">
          <strong className="flex w-36 flex-shrink-0 items-center pt-0.5 font-normal text-dark-600 dark:text-light-600">
            <span className="w-8 flex-shrink-0 text-dark-900 dark:text-light-900">
              <LabelIcon className="h-5 w-5" />
            </span>
            {t('text-tags')}:
          </strong>
          <div className="flex flex-wrap gap-2">
            {tags?.map((tag: Tag) => (
              <AnchorLink
                key={tag.id}
                href={routes.tagUrl(tag.slug)}
                className="inline-flex items-center justify-center rounded border border-light-600 px-2 py-0.5 font-medium text-light-base transition-all hover:bg-light-200 hover:text-dark-300 dark:border-dark-500 dark:text-light-600 dark:hover:bg-dark-400 hover:dark:text-light"
              >
                {tag.name}
              </AnchorLink>
            ))}
            {customTags?.map((tag: CustomTag, index: number) => (
              <AnchorLink
                key={`custom-tag-${index}`}
                href={getTagRedirectionUrl(tag.slug)}
                className="inline-flex items-center justify-center rounded border border-light-600 px-2 py-0.5 font-medium text-light-base transition-all hover:bg-light-200 hover:text-dark-300 dark:border-dark-500 dark:text-light-600 dark:hover:bg-dark-400 hover:dark:text-light"
              >
                {tag.name}
              </AnchorLink>
            ))}
          </div>
        </div>
      )}
      <div className="flex items-start text-dark dark:text-light">
        <strong className="flex w-36 flex-shrink-0 items-center font-normal text-dark-600 dark:text-light-600">
          <span className="w-8 flex-shrink-0 text-dark-900 dark:text-light-900">
            <PencilIcon className="h-[18px] w-[18px]" />
          </span>
          {t('text-license')}:
        </strong>
        <span className="font-medium">
          <AnchorLink
            id="license-link"
            key="license-link"
            href={getLicenseRedirectUrl(license?.id ?? '')}
          >
            {license ? license.name : t('text-standard-a4g-license')}
          </AnchorLink>
        </span>
      </div>
    </div>
  )
}
