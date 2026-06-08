import React from 'react'
import MUITextField, { type TextFieldProps as MUITextFieldProps } from '@mui/material/TextField'

import { uncontrolledInputProps, type InputValue } from '../utils/uncontrolledInput.js'

export type TextFieldProps = Omit<MUITextFieldProps, 'value' | 'onChange' | 'defaultValue'> & {
  value?: InputValue
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
}

const TextField = ({ value, onChange, select, type, ...props }: TextFieldProps) => {
  if (select) {
    return (
      <MUITextField
        {...props}
        type={type}
        select
        value={value ?? ''}
        onChange={onChange}
      />
    )
  }

  const { defaultValue, onChange: inputOnChange, ref: inputRef } = uncontrolledInputProps(value, onChange, type)

  return <MUITextField {...props} type={type} defaultValue={defaultValue} onChange={inputOnChange} inputRef={inputRef} />
}

export default TextField
