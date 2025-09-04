import React, { useState } from 'react'
import AnchorLink from '@/components/ui/links/anchor-link'
import routes from '@/config/routes'
import { RecyclingIcon } from '@/components/icons/recycling-icon'

interface AnimatedPageTitleProps {
  className?: string
}

const AnimatedPageTitle: React.FC<AnimatedPageTitleProps> = ({
  className = '',
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const recyclingIconStyle = {
    transformOrigin: 'center',
    display: 'inline-block',
    transition: 'transform 2s ease-in-out',
    transform: isHovered ? 'rotate(360deg)' : 'rotate(0deg)',
    verticalAlign: 'middle'
  }

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <AnchorLink
        className={`header-storename ${className}`}
        id="page-title-link"
        aria-label="Return to Home Page"
        href={routes.home}
        {...props}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className="font-adlib text-blue dark:text-light">Assets</span>
          <span
            style={{
              color: '#63AF21',
              fontSize: '2em',
              fontFamily: 'Adlib, sans-serif',
              ...recyclingIconStyle
            }}
          >
            {isHovered ? (
              <RecyclingIcon />
            ) : (
              <span className="font-adlib">4</span>
            )}
          </span>
          <span className="font-adlib text-blue dark:text-light">Godot</span>
        </div>
      </AnchorLink>
      <div className="hidden">
        Fonts made from <a href="http://www.onlinewebfonts.com">Web Fonts</a> is
        licensed by CC BY 4.0
      </div>
    </div>
  )
}

export default AnimatedPageTitle
