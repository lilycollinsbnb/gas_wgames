import React from 'react';
import AnchorLink from "@/components/ui/links/anchor-link";
import routes from "@/config/routes";

interface PageTitleProps {
    className?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ className = '', ...props }) => {
    return (
        <div>
            <AnchorLink
                className={`header-storename ${className}`}
                id="page-title-link"
                aria-label="Return to Home Page"
                href={routes.home}
                {...props}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className='font-adlib text-blue dark:text-light'>Assets</span>
                    <span className='font-adlib text-[2em] text-green'>4</span>
                    <span className='font-adlib text-blue dark:text-light'>Godot</span>
                </div>
            </AnchorLink>

            <div className='hidden'>Fonts made from <a href="http://www.onlinewebfonts.com">Web Fonts</a> is licensed by CC BY 4.0</div>
        </div>
    );
};

export default PageTitle;