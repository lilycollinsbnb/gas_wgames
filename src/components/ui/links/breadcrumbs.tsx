import * as React from 'react'
import ActiveLink from './active-link'
import classNames from 'classnames'

export interface IBreadrumbsProps {
  path: string
  ignoredPathFragments?: string[]
}

export default function DynamicBreadcrumbs({
  path,
  ignoredPathFragments = []
}: IBreadrumbsProps) {
  const pathSegments = path
    .split('/')
    .filter((segment) => segment)
    .filter((segment) => !ignoredPathFragments.includes(segment))

  return (
    <div aria-label="breadcrumb">
      <ol
        className="breadcrumb"
        style={{ display: 'flex', alignItems: 'center' }}
      >
        {/* <li>
          <ActiveLink href="/" activeClassName="active">
            Home
          </ActiveLink>
        </li> */}
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join('/')}`
          const isActive = index === pathSegments.length - 1
          // remove query params
          const cleanSegment = segment.split('?')[0]
          const segmentName = cleanSegment
            .split('-')
            .map((word) => {
              return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            })
            .join(' ')
          return (
            <li
              key={index}
              style={{ display: 'flex', alignItems: 'center' }}
              className={classNames({ active: isActive })} // Apply active class
            >
              {index !== 0 && <span style={{ margin: '0 5px' }}>{'>'}</span>}
              {isActive ? (
                <span className="active">{segmentName}</span> // Active class for current page
              ) : (
                <ActiveLink href={href} activeClassName="active">
                  {segmentName}
                </ActiveLink>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
