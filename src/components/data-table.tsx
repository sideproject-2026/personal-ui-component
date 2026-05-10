import * as React from 'react'
import { useForm } from 'react-hook-form'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { cx } from '../utils/cx'

type SearchFormValues = {
  query: string
}

export type DataTableSearchConfig<TData> = {
  accessor: (row: TData) => string | number | null | undefined
  label?: string
  placeholder?: string
}

export type DataTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  title?: string
  description?: string
  emptyMessage?: string
  pageSize?: number
  className?: string
  search?: DataTableSearchConfig<TData>
}

export function DataTable<TData>({
  columns,
  data,
  title,
  description,
  emptyMessage = 'No records found.',
  pageSize = 8,
  className,
  search,
}: DataTableProps<TData>) {
  const searchId = React.useId()
  const { register, watch } = useForm<SearchFormValues>({
    defaultValues: {
      query: '',
    },
  })

  const query = watch('query').trim().toLowerCase()

  const filteredData = React.useMemo(() => {
    if (!search || query.length === 0) {
      return data
    }

    return data.filter((row) => {
      const value = search.accessor(row)
      return String(value ?? '').toLowerCase().includes(query)
    })
  }, [data, query, search])

  const table = useReactTable({
    data: filteredData,
    columns,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  React.useEffect(() => {
    table.setPageIndex(0)
  }, [query, table])

  const visibleColumnCount = table.getVisibleLeafColumns().length || columns.length || 1

  return (
    <section className={cx('w-full text-left text-slate-900', className)}>
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_-42px_rgba(15,23,42,0.45)]">
        {(title || description || search) && (
          <header className="flex flex-col gap-4 border-b border-slate-200 bg-gradient-to-r from-white via-stone-50 to-amber-50 px-5 py-5 sm:px-6">
            <div className="space-y-1">
              {title && <h2 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h2>}
              {description && <p className="text-sm text-slate-600">{description}</p>}
            </div>

            {search && (
              <div className="max-w-md">
                <label htmlFor={searchId} className="mb-2 block text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
                  {search.label ?? 'Search'}
                </label>
                <input
                  id={searchId}
                  type="search"
                  placeholder={search.placeholder ?? 'Search records'}
                  className="block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                  {...register('query')}
                />
              </div>
            )}
          </header>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-slate-50 text-slate-600">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] sm:px-6"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td className="px-5 py-10 text-center text-sm text-slate-500 sm:px-6" colSpan={visibleColumnCount}>
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-t border-slate-200 transition hover:bg-amber-50/40">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-5 py-4 align-top text-slate-700 sm:px-6">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <footer className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            Showing {table.getRowModel().rows.length} of {filteredData.length} records
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="rounded-full border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:border-slate-400 hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
            >
              Previous
            </button>
            <span className="min-w-24 text-center text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
            </span>
            <button
              type="button"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="rounded-full border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:border-slate-400 hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
            >
              Next
            </button>
          </div>
        </footer>
      </div>
    </section>
  )
}