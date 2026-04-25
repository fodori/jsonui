import React from 'react'

export function SubmitButton(props: Record<string, unknown>) {
  const {
    children,
    style,
    fieldErrors,
    fieldTouched,
    onClick,
    ...rest
  } = props

  const disabled = !fieldTouched || !!fieldErrors

  return (
    <button
      style={{
        ...(style as React.CSSProperties),
        ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
      }}
      disabled={disabled}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      onClick={onClick as any}
      {...rest}
    >
      {children as React.ReactNode}
    </button>
  )
}
