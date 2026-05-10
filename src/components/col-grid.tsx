import type * as React from 'react'
import { cx } from '../utils/cx'

const orientationClasses = {
  row: 'grid-flow-row',
  column: 'grid-flow-col',
} as const

const alignmentClasses = {
  start: 'items-start justify-items-start',
  center: 'items-center justify-items-center',
  end: 'items-end justify-items-end',
  stretch: 'items-stretch justify-items-stretch',
} as const

const colSpanClasses = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
  7: 'col-span-7',
  8: 'col-span-8',
  9: 'col-span-9',
  10: 'col-span-10',
  11: 'col-span-11',
  12: 'col-span-12',
} as const

const columnsClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
   3: 'grid-cols-3',
   4: 'grid-cols-4',
   5: 'grid-cols-5',
   6: 'grid-cols-6',
   7: 'grid-cols-7',
   8: 'grid-cols-8',
   9: 'grid-cols-9',
   10: 'grid-cols-10',
   11: 'grid-cols-11',
   12: 'grid-cols-12',
} as const

type ColSpan = keyof typeof colSpanClasses
type GridAlignment = keyof typeof alignmentClasses
type GridOrientation = keyof typeof orientationClasses
type GridColumns = keyof typeof columnsClasses

export type ColGridProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: GridOrientation
  colSpan?: ColSpan
  gap?: number | string
  align?: GridAlignment
  columns?: GridColumns
}



export function ColGrid({
  orientation = 'row',
  colSpan,
   columns,
  gap,
  align = 'stretch',
  className,
  style,
  children,
  ...props
}: ColGridProps) {
  const mergedStyle = gap === undefined
    ? style
    : {
        ...style,
        '--col-grid-gap': typeof gap === 'number' ? `${gap}px` : gap,
      }

  return (
    <div
      className={cx(
        'grid',
        orientationClasses[orientation],
        alignmentClasses[align],
         columns ? columnsClasses[columns] : undefined,
        colSpan ? colSpanClasses[colSpan] : undefined,
        gap === undefined ? undefined : 'gap-(--col-grid-gap)',
        className,
      )}
      style={mergedStyle}
      {...props}
    >
      {children}
    </div>
  )
}