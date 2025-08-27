import * as React from 'react'
import ActiveLink from './active-link'
import { BreadcrumbItem } from '@/types'

interface StaticBreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function StaticBreadcrumbs({ items }: StaticBreadcrumbsProps) {
  return (
    <div aria-label="breadcrumb">
      <ol className="breadcrumb flex items-center text-sm text-gray-600 dark:text-gray-400 space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={index} className="flex items-center">
              {index !== 0 && <span className="mx-2">›</span>}
              {isLast ? (
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {item.label}
                </span>
              ) : (
                <ActiveLink href={item.href} activeClassName="font-semibold">
                  {item.label}
                </ActiveLink>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
