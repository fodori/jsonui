import React from 'react'
import MUITextField, { TextFieldProps as MUITextFieldProps } from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

interface SelectOptions {
  label?: string
  value: string
  disabled?: boolean
}
export type SelectProps = MUITextFieldProps & {
  options: SelectOptions[]
  onChange: (value: any) => void
}

const Select = ({ options, onChange, ...props }: SelectProps) => (
  <MUITextField
    {...props}
    select
    onChange={(event: any) => onChange(event?.target?.value)}
    InputLabelProps={{
      shrink: !!props.value || props.value === '',
      ...props?.InputLabelProps,
    }}
  >
    {options?.map((i, index) => (
      <MenuItem {...i} key={i?.value || index}>
        {i.label}
      </MenuItem>
    ))}
  </MUITextField>
)

export default Select
