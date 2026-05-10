import * as React from 'react'
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
  type UseFormReturn,
} from 'react-hook-form'
import { cx } from '../utils/cx'

type InputFormOrientation = 'column' | 'row'
type InputFormAlignIcon = 'left' | 'right'
type InputFormSize = 'lg' | 'sm' | 'xs'

type InputFormControl<TFieldValues extends FieldValues> =
  | Control<TFieldValues>
  | UseFormReturn<TFieldValues>

const orientationClasses: Record<InputFormOrientation, string> = {
  column: 'flex-col items-start',
  row: 'flex-row items-center',
}

const sizeClasses: Record<
  InputFormSize,
  {
    label: string
    input: string
    message: string
    icon: string
    fieldPadding: string
  }
> = {
  lg: {
    label: 'text-sm',
    input: 'min-h-11 text-sm',
    message: 'text-xs',
    icon: 'size-5',
    fieldPadding: 'px-4 py-3',
  },
  sm: {
    label: 'text-[10px]',
    input: 'min-h-10 text-[12px]',
    message: 'text-[11px]',
    icon: 'size-4',
    fieldPadding: 'px-3 py-2.5',
  },
  xs: {
    label: 'text-[10px]',
    input: 'min-h-8 text-[11px]',
    message: 'text-[10px]',
    icon: 'size-3.5',
    fieldPadding: 'px-2.5 py-2',
  },
}

function getControl<TFieldValues extends FieldValues>(
  control: InputFormControl<TFieldValues>,
): Control<TFieldValues> {
  if ('control' in control) {
    return control.control
  }

  return control
}

export type InputFormProps<TFieldValues extends FieldValues> = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'name' | 'size'
> & {
  control: InputFormControl<TFieldValues>
  name: FieldPath<TFieldValues>
  label?: string
  errorMessage?: string
  icon?: React.ReactNode
  alignIcon?: InputFormAlignIcon
  orientation?: InputFormOrientation
  baseClassName?: string
  inputClassName?: string
  labelClassName?: string
  size?: InputFormSize
}

export function InputForm<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  errorMessage,
  icon,
  alignIcon = 'left',
  orientation = 'column',
  baseClassName,
  inputClassName,
  labelClassName,
  size = 'sm',
  id,
  disabled,
  className,
  ...inputProps
}: InputFormProps<TFieldValues>) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const fieldSize = sizeClasses[size]
  const normalizedControl = getControl(control)

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control: normalizedControl,
  })

  const message = error?.message ?? errorMessage
  const hasError = Boolean(message)

  return (
    <div
      className={cx(
        'flex gap-2',
        orientationClasses[orientation],
        orientation === 'row' ? 'justify-between' : undefined,
        baseClassName,
      )}
    >
      {label ? (
        <label
          htmlFor={inputId}
          className={cx(
            'font-medium text-slate-700',
            fieldSize.label,
            disabled ? 'opacity-60' : undefined,
            labelClassName,
          )}
        >
          {label}
        </label>
      ) : null}

      <div className={cx('w-full', className)}>
        <div className="relative">
          {icon ? (
            <span
              aria-hidden="true"
              className={cx(
                'pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400',
                fieldSize.icon,
                alignIcon === 'left' ? 'left-3' : 'right-3',
              )}
            >
              {icon}
            </span>
          ) : null}

          <input
            {...inputProps}
            {...field}
            id={inputId}
            disabled={disabled}
            aria-invalid={hasError}
            className={cx(
              'w-full rounded-sm border bg-white text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500',
              fieldSize.input,
              fieldSize.fieldPadding,
              hasError
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100'
                : 'border-slate-300',
              icon && alignIcon === 'left' ? 'pl-10' : undefined,
              icon && alignIcon === 'right' ? 'pr-10' : undefined,
              inputClassName,
            )}
            onBlur={(event) => {
              field.onBlur()
              inputProps.onBlur?.(event)
            }}
            onChange={(event) => {
              field.onChange(event)
              inputProps.onChange?.(event)
            }}
            value={field.value ?? ''}
            name={field.name}
            ref={field.ref}
          />
        </div>

        {message ? (
          <p className={cx('mt-1 text-rose-600', fieldSize.message)} role="alert">
            {message}
          </p>
        ) : null}
      </div>
    </div>
  )
}