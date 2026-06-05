import React from 'react'
import { useControlledInputValue } from '../hooks/useControlledInputValue.js'
import { JsonUINode } from '@jsonui/core'

export const Edit = ({ value, onChange, onPress, style, $ctx, helperText, label, ...rest }: JsonUINode) => {
  const { fieldErrors, fieldTouched } = $ctx ?? {}
  const handleChange = (onChange ?? onPress) as React.ChangeEventHandler<HTMLInputElement> | undefined
  const { value: inputValue, onChange: inputOnChange, ref: inputRef } = useControlledInputValue((value ?? '') as string, handleChange)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
      }}
    >
      {label ? (
        <div
          style={{
            fontSize: 14,
            marginTop: 12,
          }}
        >
          {
            <>
              {label} {fieldTouched ? `(touched)` : ''}
            </>
          }
        </div>
      ) : null}
      <input ref={inputRef} style={style as React.CSSProperties} value={inputValue} onChange={inputOnChange} {...rest} />
      {fieldErrors || helperText ? (
        <div
          style={{
            color: fieldErrors ? '#c00' : undefined,
            fontSize: 12,
            marginTop: 4,
          }}
        >
          {fieldErrors ? String(fieldErrors) : <>{helperText}</>}
        </div>
      ) : null}
    </div>
  )
}
