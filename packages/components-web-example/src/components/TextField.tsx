import React from 'react'
import MUITextField, { TextFieldProps as MUITextFieldProps } from '@mui/material/TextField'

export type TextFieldProps = MUITextFieldProps & {
  onChange: (value: any) => void
}

const TextField = (props: TextFieldProps) => (
  <MUITextField
    {...props}
    InputLabelProps={{
      shrink: !!props.value || props.value === '',
      ...props?.InputLabelProps,
    }}
    value={props.value || ''}
    onChange={(event: any) => props.onChange(event?.target?.value)}
  />
)

export default TextField
