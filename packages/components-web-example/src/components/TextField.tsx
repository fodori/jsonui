import React from 'react'
import MUITextField, { TextFieldProps as MUITextFieldProps } from '@mui/material/TextField'
import { useControlledInputValue } from '@jsonui/react'

export type TextFieldProps = MUITextFieldProps & {
  onChange: (value: any) => void
}

const TextField = (props: TextFieldProps) => {
  const handleChange = props.onChange as React.ChangeEventHandler<HTMLInputElement> | undefined
  const { value: inputValue, onChange: inputOnChange, ref: inputRef } = useControlledInputValue((props.value ?? '') as string | number, handleChange, props.type)
  return <MUITextField {...props} value={inputValue} onChange={inputOnChange} ref={inputRef} />
}

export default TextField
