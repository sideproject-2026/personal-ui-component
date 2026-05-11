

export const TextCell = ({
  children,
  alignment,
  className,
}: {
  children: React.ReactNode
  alignment?: 'start' | 'center' | 'end'
  className?: string
}) => {
  const alignmentClass = alignment ? `justify-${alignment}` : 'justify-start'
  return (
    <div
      className={`text-sm ${alignmentClass} w-full flex flex-row items-center ${className}`}
    >
      {children}
    </div>
  )
}


export const TextCenterColumn = ({
  text,
  children,
}: {
  text?: string
  children?: React.ReactNode
}) => (
  <div className="w-full flex justify-center items-center">
    {children ? children : <span className="text-sm text-center">{text}</span>}
  </div>
)