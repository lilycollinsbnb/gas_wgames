import { forwardRef } from 'react'
import cn from 'classnames'
import { useTranslation } from 'next-i18next'

interface CheckBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | any
  id?: string
  error?: string
  className?: string
}

const CheckBox = forwardRef<HTMLInputElement, CheckBoxProps>(
  ({ id, error, label, className, ...rest }, ref) => {
    const { t } = useTranslation('common')
    return (
      <div>
        <label
          className={cn(
            'group flex cursor-pointer items-center text-13px transition-all',
            className
          )}
        >
          <input
            type="checkbox"
            className="checkbox-component invisible absolute -z-[1] opacity-0"
            ref={ref}
            {...rest}
          />
          <span />
          <span className="text-dark/70 ltr:ml-2.5 rtl:mr-2.5 dark:text-light/70">
            {typeof label === 'string' ? t(label) : label}
          </span>
        </label>
        {error && (
          <span
            id={`checkbox-error-${id}`}
            role="alert"
            className="block pt-2 text-xs text-warning mb-3"
          >
            {t(error)}
          </span>
        )}
      </div>
    )
  }
)

CheckBox.displayName = 'CheckBox'
export default CheckBox
