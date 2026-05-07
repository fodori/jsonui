import React from 'react'
import { useControlledInputValue } from '../hooks/useControlledInputValue.js'

export const Edit = ({ value, onChange, onPress, style, error, helperText, ...rest }: Record<string, unknown>) => {
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
      <input ref={inputRef} style={style as React.CSSProperties} value={inputValue} onChange={inputOnChange} {...rest} />
      {error || helperText ? (
        <div
          style={{
            color: error ? '#c00' : undefined,
            fontSize: 12,
            marginTop: 4,
          }}
        >
          {error ? String(error) : <>{helperText}</>}
        </div>
      ) : null}
    </div>
  )
}
