
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cx } from '../utils/cx'

const buttonLoadingVariants = cva(
	'inline-flex items-center justify-center gap-2 rounded-sm border text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60',
	{
		variants: {
			variant: {
				fill: 'border-transparent shadow-sm',
				ghost: 'border-transparent bg-transparent shadow-none',
				outline: 'bg-white shadow-none',
			},
			theme: {
				primary: '',
				secondary: '',
				success: '',
				danger: '',
				mute: '',
			},
			size: {
				large: 'min-h-11 px-5 py-2.5',
				small: 'min-h-9 px-4 py-2 text-sm',
				'extra-small': 'min-h-8 px-3 py-1.5 text-xs',
				icon: 'h-10 w-10 p-0',
			},
		},
		compoundVariants: [
			{
				variant: 'fill',
				theme: 'primary',
				className: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
			},
			{
				variant: 'fill',
				theme: 'secondary',
				className: 'bg-violet-600 text-white hover:bg-violet-700 focus-visible:ring-violet-500',
			},
			{
				variant: 'fill',
				theme: 'success',
				className: 'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500',
			},
			{
				variant: 'fill',
				theme: 'danger',
				className: 'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500',
			},
			{
				variant: 'fill',
				theme: 'mute',
				className: 'bg-slate-600 text-white hover:bg-slate-700 focus-visible:ring-slate-500',
			},
			{
				variant: 'outline',
				theme: 'primary',
				className: 'border-blue-200 text-blue-700 hover:bg-blue-50 focus-visible:ring-blue-500',
			},
			{
				variant: 'outline',
				theme: 'secondary',
				className: 'border-violet-200 text-violet-700 hover:bg-violet-50 focus-visible:ring-violet-500',
			},
			{
				variant: 'outline',
				theme: 'success',
				className: 'border-emerald-200 text-emerald-700 hover:bg-emerald-50 focus-visible:ring-emerald-500',
			},
			{
				variant: 'outline',
				theme: 'danger',
				className: 'border-rose-200 text-rose-700 hover:bg-rose-50 focus-visible:ring-rose-500',
			},
			{
				variant: 'outline',
				theme: 'mute',
				className: 'border-slate-200 text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-500',
			},
			{
				variant: 'ghost',
				theme: 'primary',
				className: 'text-blue-700 hover:bg-blue-50 focus-visible:ring-blue-500',
			},
			{
				variant: 'ghost',
				theme: 'secondary',
				className: 'text-violet-700 hover:bg-violet-50 focus-visible:ring-violet-500',
			},
			{
				variant: 'ghost',
				theme: 'success',
				className: 'text-emerald-700 hover:bg-emerald-50 focus-visible:ring-emerald-500',
			},
			{
				variant: 'ghost',
				theme: 'danger',
				className: 'text-rose-700 hover:bg-rose-50 focus-visible:ring-rose-500',
			},
			{
				variant: 'ghost',
				theme: 'mute',
				className: 'text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-500',
			},
		],
		defaultVariants: {
			variant: 'fill',
			theme: 'primary',
			size: 'small',
		},
	},
)

function SpinnerIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			aria-hidden="true"
			className="h-4 w-4 animate-spin"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle cx="12" cy="12" r="10" className="opacity-25" stroke="currentColor" strokeWidth="4" />
			<path
				className="opacity-90"
				fill="currentColor"
				d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2Z"
			/>
		</svg>
	)
}

export type ButtonLoadingProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
	VariantProps<typeof buttonLoadingVariants> & {
		isLoading?: boolean
		text?: string
		loadingText?: string
		icon?: React.ReactNode
	}

export function ButtonLoading({
	isLoading = false,
	variant,
	theme,
	size,
	text,
	loadingText,
	icon,
	className,
	disabled,
	type = 'button',
	...buttonProps
}: ButtonLoadingProps) {
	const content = isLoading ? loadingText ?? text : text
	const iconOnly = size === 'icon'

	return (
		<button
			type={type}
			className={cx(buttonLoadingVariants({ variant, theme, size }), className)}
			disabled={disabled || isLoading}
			aria-busy={isLoading}
			{...buttonProps}
		>
			{isLoading ? <SpinnerIcon /> : icon}
			{!iconOnly && content ? <span>{content}</span> : null}
			{iconOnly && !isLoading && !icon ? <span className="sr-only">{text ?? 'Button'}</span> : null}
			{iconOnly && isLoading && content ? <span className="sr-only">{content}</span> : null}
		</button>
	)
}