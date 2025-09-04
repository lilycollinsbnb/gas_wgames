import { useState } from 'react'
import cn from 'classnames'
import { ChevronDown } from '@/components/icons/chevron-down'
import { ChevronRight } from '@/components/icons/chevron-right'
import { NavLink } from './_nav-link'

interface NavGroupProps {
  title: string
  hint: string
  icon: React.ReactNode
  href: string
  isCollapse?: boolean
  children: React.ReactNode
}

export function NavGroup({
  title,
  hint,
  icon,
  href,
  isCollapse,
  children
}: NavGroupProps) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : !!children

  const [isOpen, setIsOpen] = useState(false)
  const toggleOpen = () => setIsOpen(!isOpen)

  return (
    <div>
      <NavLink
        href={href}
        icon={icon}
        isCollapse={isCollapse}
        hint={hint}
        title={
          <span className="flex w-full items-center justify-between">
            <span
              className={cn(
                'text-dark-100 dark:text-light-400',
                isCollapse ? 'sm:hidden' : 'inline'
              )}
            >
              {title}
            </span>
            {hasChildren && (
              <span
                className={cn(
                  isCollapse ? 'ml-2 sm:hidden' : 'ml-2 inline-flex',
                  'w-11 h-11 justify-center items-center'
                )}
                onClick={(e) => {
                  e.preventDefault()
                  toggleOpen()
                }}
              >
                {isOpen ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </span>
            )}
          </span>
        }
      />
      {hasChildren && isOpen && !isCollapse && (
        <div className="mt-1">{children}</div>
      )}
    </div>
  )
}
