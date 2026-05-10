import type * as React from 'react'
import { cx } from '../utils/cx'

export type StackProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: 'vertical' | 'horizontal'
  gap?: number,
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
}

export function Stack({
  orientation = 'vertical',
  gap = 0,
  align = 'start',
  justify = 'start',
  className,
  children,
  ...props
}: StackProps) {
  return (
    <div
      className={cx(
        'flex',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        gap && `gap-${gap}`,
        `items-${align === 'start' ? 'start' : align === 'center' ? 'center' : align === 'end' ? 'end' : 'stretch'}`,
        `justify-${justify === 'start' ? 'start' : justify === 'center' ? 'center' : justify === 'end' ? 'end' : justify === 'between' ? 'between' : 'around'}`,  
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}