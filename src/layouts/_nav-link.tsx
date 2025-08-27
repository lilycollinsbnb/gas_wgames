import ActiveLink from '@/components/ui/links/active-link'
import cn from 'classnames'
import React from 'react'

interface NavLinkProps {
  href: string
  title: React.ReactNode
  hint: string
  icon: React.ReactNode
  isCollapse?: boolean
  nested?: boolean
}

export function NavLink({
  href,
  icon,
  title,
  hint,
  isCollapse,
  nested
}: NavLinkProps) {
  return (
    <ActiveLink
      href={href}
      title={hint}
      className={cn(
        'my-0.5 flex items-center gap-1 px-4 py-3 hover:bg-light-300 hover:dark:bg-dark-300 xs:px-6 sm:my-1 sm:gap-1.5 sm:px-7 lg:gap-2 xl:my-0.5'
      )}
      activeClassName="text-dark-100 active-text-dark dark:active-text-light dark:text-light-400 font-medium bg-light-400 dark:bg-dark-400 hover:bg-light-600 hover:dark:bg-dark-500"
    >
      <span
        className={cn(
          'flex flex-shrink-0 items-center justify-start',
          isCollapse ? 'w-8 xl:w-auto' : 'w-auto xl:w-8',
          nested && 'ml-10'
        )}
      >
        {icon}
      </span>
      <span
        className={cn(
          'text-dark-100 dark:text-light-400',
          isCollapse ? 'sm:hidden' : 'inline'
        )}
      >
        {title}
      </span>
    </ActiveLink>
  )
}
