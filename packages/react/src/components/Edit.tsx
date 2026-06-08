import React from 'react'
import { uncontrolledInputProps, type InputValue } from '../utils/uncontrolledInput.js'
import { JsonUINode } from '@jsonui/core'

export const Edit = ({ value, onChange, onPress, style, $ctx, helperText, label, ...rest }: JsonUINode) => {
  const { fieldErrors, fieldTouched } = $ctx ?? {}
  const handleChange = (onChange ?? onPress) as React.ChangeEventHandler<HTMLInputElement> | undefined
  const inputType = (rest as { type?: string }).type
  const { defaultValue, onChange: inputOnChange, ref: inputRef } = uncontrolledInputProps(value as InputValue, handleChange, inputType)

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
      <input {...rest} ref={inputRef} style={style as React.CSSProperties} defaultValue={defaultValue} onChange={inputOnChange} />
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
