import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import type {
  ColumnDef,
  ColumnResizeMode,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'
import {
  ZSelect,
  ZSelectContent,
  ZSelectItem,
  ZSelectTrigger,
  ZSelectValue,
} from '../selects'
import { ZButton } from '../buttons'
import { cx } from '../../utils/cx'
import type { PaginatedResponse } from '../../types/common'

type DataTablePaginationProps<TData> = {
  response: PaginatedResponse<TData>
  columns: Array<ColumnDef<TData, unknown>>
  isLoading?: boolean
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  getRowId?: (row: TData) => string
  enableColumnResizing?: boolean
  columnResizeMode?: ColumnResizeMode
  hideColumns?: Array<string>
}

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50]

const DataTablePagination = <TData,>({
  response,
  columns,
  isLoading = false,
  onPageChange,
  onPageSizeChange,
  getRowId,
  enableColumnResizing = false,
  columnResizeMode = 'onChange',
  hideColumns = [],
}: DataTablePaginationProps<TData>) => {
  const { data, currentPage, pageSize, totalCount, totalPages } = response

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () =>
      hideColumns.reduce<VisibilityState>((visibility, columnId) => {
        visibility[columnId] = false
        return visibility
      }, {}),
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId,
    enableColumnResizing,
    columnResizeMode,
  })

  const start = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, totalCount)

  useEffect(() => {
    if (hideColumns.length === 0) return

    setColumnVisibility((prev) => {
      let hasChanges = false
      const next = { ...prev }

      hideColumns.forEach((columnId) => {
        if (next[columnId] !== false) {
          next[columnId] = false
          hasChanges = true
        }
      })

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      return hasChanges ? next : prev
    })
  }, [hideColumns])

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto border border-border rounded-md">
        <table className="min-w-full w-max whitespace-nowrap text-sm">
          <thead className="bg-primary">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const headerStyle: CSSProperties | undefined =
                    enableColumnResizing
                      ? {
                          width: header.getSize(),
                          minWidth:
                            header.column.columnDef.minSize ?? undefined,
                          maxWidth:
                            header.column.columnDef.maxSize ?? undefined,
                        }
                      : undefined

                  const meta = header.column.columnDef.meta as any
                  return (
                    <th
                      key={header.id}
                      className={cx(
                        'relative px-4 py-3 text-left font-semibold font-sans text-white',
                        meta?.headerClassName,
                        meta?.className,
                      )}
                      style={headerStyle}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? 'flex items-center gap-2 cursor-pointer select-none'
                              : 'flex items-center'
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: <span className="text-xs">▲</span>,
                            desc: <span className="text-xs">▼</span>,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                      {enableColumnResizing && header.column.getCanResize() && (
                        <div
                          role="separator"
                          aria-orientation="vertical"
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          onClick={(event) => event.stopPropagation()}
                          className={`absolute right-0 top-0 h-full w-[2px] cursor-col-resize select-none touch-none ${header.column.getIsResizing() ? 'bg-primary/50' : 'bg-border hover:bg-primary/40'}`}
                        />
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  className="px-4 py-6 text-center text-muted-foreground"
                  colSpan={Math.max(columns.length, 1)}
                >
                  Loading…
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-6 text-center text-muted-foreground"
                  colSpan={Math.max(columns.length, 1)}
                >
                  No records found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  className={`border-t border-border ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-sky-100'}`}
                >
                  {row.getVisibleCells().map((cell, index) => {
                    const meta = cell.column.columnDef.meta as any
                    const cellStyle: CSSProperties | undefined =
                      enableColumnResizing
                        ? {
                            width: cell.column.getSize(),
                            minWidth:
                              cell.column.columnDef.minSize ?? undefined,
                            maxWidth:
                              cell.column.columnDef.maxSize ?? undefined,
                          }
                        : undefined

                    return (
                      <td
                        key={index}
                        className={cx(
                          'px-4 py-3 align-top text-foreground/90',
                          meta?.className,
                        )}
                        style={cellStyle}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
        <span>
          Showing {start.toLocaleString()}–{end.toLocaleString()} of{' '}
          {totalCount.toLocaleString()}
        </span>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span>Page size</span>
            <ZSelect
              value={String(pageSize)}
              onValueChange={(value) => onPageSizeChange?.(Number(value))}
            >
              <ZSelectTrigger className="w-[96px]">
                <ZSelectValue />
              </ZSelectTrigger>
              <ZSelectContent>
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <ZSelectItem key={option} value={String(option)}>
                    {option}
                  </ZSelectItem>
                ))}
              </ZSelectContent>
            </ZSelect>
          </div>

          <div className="flex items-center gap-2">
            <ZButton
              type="button"
              variant="outline"
              theme="mute"
              className="rounded border border-border px-3 py-1 disabled:opacity-40"
              onClick={() => onPageChange?.(1)}
              disabled={currentPage <= 1}
            >
              « First
            </ZButton>
            <ZButton
              type="button"
              variant="outline"
              theme="mute"
              className="rounded border border-border px-3 py-1 disabled:opacity-40"
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ‹ Prev
            </ZButton>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <ZButton
              type="button"
              variant="outline"
              theme="mute"
              className="rounded border border-border px-3 py-1 disabled:opacity-40"
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next ›
            </ZButton>
            <ZButton
              type="button"
              variant="outline"
              theme="mute"
              className="rounded border border-border px-3 py-1 disabled:opacity-40"
              onClick={() => onPageChange?.(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Last »
            </ZButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataTablePagination
