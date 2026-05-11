import * as React from 'react'
import { cx } from '../../utils/cx'

export type ZSelectOption = {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

type RegisteredSelectItem = {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

type ZSelectContextValue = {
  value: string | undefined
  onValueChange: (value: string) => void
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  disabled?: boolean
  items?: ZSelectOption[]
  registeredItems: Map<string, RegisteredSelectItem>
  registerItem: (item: RegisteredSelectItem) => () => void
  placeholder?: string
  triggerId: string
  contentId: string
}

const ZSelectContext = React.createContext<ZSelectContextValue | null>(null)

function useZSelectContext(componentName: string) {
  const context = React.useContext(ZSelectContext)

  if (!context) {
    throw new Error(`${componentName} must be used within ZSelect`)
  }

  return context
}

function useControllableState({
  value,
  defaultValue,
  onChange,
}: {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const setValue = React.useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setInternalValue(nextValue)
      }

      onChange?.(nextValue)
    },
    [isControlled, onChange],
  )

  return [currentValue, setValue] as const
}

function getTextValue(children: React.ReactNode) {
  if (typeof children === 'string' || typeof children === 'number') {
    return children
  }

  return undefined
}

function ChevronIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

export type ZSelectProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  items?: ZSelectOption[]
  placeholder?: string
  name?: string
  disabled?: boolean
}

export function ZSelect({
  value: valueProp,
  defaultValue,
  onValueChange,
  items,
  placeholder,
  name,
  disabled,
  className,
  children,
  ...divProps
}: ZSelectProps) {
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  })
  const [open, setOpen] = React.useState(false)
  const [registeredItems, setRegisteredItems] = React.useState<Map<string, RegisteredSelectItem>>(
    () => new Map(),
  )
  const triggerId = React.useId()
  const contentId = React.useId()
  const rootRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (!open) {
      return undefined
    }

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const registerItem = React.useCallback((item: RegisteredSelectItem) => {
    setRegisteredItems((currentItems) => {
      const nextItems = new Map(currentItems)
      nextItems.set(item.value, item)
      return nextItems
    })

    return () => {
      setRegisteredItems((currentItems) => {
        const nextItems = new Map(currentItems)
        nextItems.delete(item.value)
        return nextItems
      })
    }
  }, [])

  const contextValue = React.useMemo<ZSelectContextValue>(
    () => ({
      value,
      onValueChange: (nextValue) => {
        setValue(nextValue)
        setOpen(false)
      },
      open,
      setOpen,
      disabled,
      items,
      registeredItems,
      registerItem,
      placeholder,
      triggerId,
      contentId,
    }),
    [contentId, disabled, items, open, placeholder, registerItem, registeredItems, setValue, triggerId, value],
  )

  return (
    <ZSelectContext.Provider value={contextValue}>
      <div
        ref={rootRef}
        className={cx('relative inline-flex w-fit flex-col', className)}
        {...divProps}
      >
        {name ? <input type="hidden" name={name} value={value ?? ''} /> : null}
        {children}
      </div>
    </ZSelectContext.Provider>
  )
}

export type ZSelectTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export const ZSelectTrigger = React.forwardRef<HTMLButtonElement, ZSelectTriggerProps>(
  function ZSelectTrigger({ className, children, type = 'button', onClick, ...buttonProps }, ref) {
    const { open, setOpen, disabled, triggerId, contentId } = useZSelectContext('ZSelectTrigger')

    return (
      <button
        ref={ref}
        id={triggerId}
        type={type}
        role="combobox"
        aria-controls={contentId}
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={disabled || buttonProps.disabled}
        className={cx(
          'flex min-h-10 items-center justify-between gap-2 rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500',
          className,
        )}
        onClick={(event) => {
          onClick?.(event)

          if (!event.defaultPrevented) {
            setOpen((currentOpen) => !currentOpen)
          }
        }}
        {...buttonProps}
      >
        <span className="flex min-w-0 flex-1 items-center text-left">{children}</span>
        <ChevronIcon className={cx('h-4 w-4 shrink-0 text-slate-500 transition-transform', open ? 'rotate-180' : undefined)} />
      </button>
    )
  },
)

ZSelectTrigger.displayName = 'ZSelectTrigger'

export type ZSelectValueProps = React.HTMLAttributes<HTMLSpanElement> & {
  placeholder?: React.ReactNode
}

export const ZSelectValue = React.forwardRef<HTMLSpanElement, ZSelectValueProps>(function ZSelectValue(
  { className, children, placeholder, ...spanProps },
  ref,
) {
  const { value, items, registeredItems, placeholder: contextPlaceholder } = useZSelectContext('ZSelectValue')
  const selectedItem = (value ? registeredItems.get(value) : undefined) ?? items?.find((item) => item.value === value)
  const content = children ?? selectedItem?.label ?? placeholder ?? contextPlaceholder ?? 'Select an option'

  return (
    <span
      ref={ref}
      className={cx('block min-w-0 flex-1 truncate', !selectedItem && !children ? 'text-slate-400' : undefined, className)}
      {...spanProps}
    >
      {content}
    </span>
  )
})

ZSelectValue.displayName = 'ZSelectValue'

export type ZSelectContentProps = React.HTMLAttributes<HTMLDivElement>

export const ZSelectContent = React.forwardRef<HTMLDivElement, ZSelectContentProps>(function ZSelectContent(
  { className, children, ...divProps },
  ref,
) {
  const { open, items, contentId, triggerId } = useZSelectContext('ZSelectContent')

  if (!open) {
    return null
  }

  return (
    <div
      ref={ref}
      id={contentId}
      role="listbox"
      aria-labelledby={triggerId}
      className={cx(
        'absolute top-[calc(100%+0.25rem)] z-50 max-h-72 min-w-[8rem] overflow-y-auto rounded-md border border-slate-200 bg-white p-1 text-slate-950 shadow-md',
        className,
      )}
      {...divProps}
    >
      {children ??
        items?.map((item) => (
          <ZSelectItem key={item.value} value={item.value} disabled={item.disabled}>
            {item.label}
          </ZSelectItem>
        ))}
    </div>
  )
})

ZSelectContent.displayName = 'ZSelectContent'

export type ZSelectItemProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string
  disabled?: boolean
  textValue?: React.ReactNode
}

export const ZSelectItem = React.forwardRef<HTMLDivElement, ZSelectItemProps>(function ZSelectItem(
  { value, disabled, textValue, className, children, onClick, ...divProps },
  ref,
) {
  const { value: selectedValue, onValueChange, registerItem } = useZSelectContext('ZSelectItem')
  const label = textValue ?? getTextValue(children) ?? children
  const isSelected = selectedValue === value

  React.useEffect(() => {
    return registerItem({ value, label, disabled })
  }, [disabled, label, registerItem, value])

  return (
    <div
      ref={ref}
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      className={cx(
        'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors',
        disabled
          ? 'pointer-events-none opacity-50'
          : 'cursor-pointer hover:bg-slate-100 focus:bg-slate-100',
        className,
      )}
      onClick={(event) => {
        onClick?.(event)

        if (!event.defaultPrevented && !disabled) {
          onValueChange(value)
        }
      }}
      onKeyDown={(event) => {
        if (disabled) {
          return
        }

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onValueChange(value)
        }
      }}
      {...divProps}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center text-slate-700">
        {isSelected ? <CheckIcon className="h-4 w-4" /> : null}
      </span>
      <span className="truncate">{children}</span>
    </div>
  )
})

ZSelectItem.displayName = 'ZSelectItem'