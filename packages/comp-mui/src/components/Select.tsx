import React from 'react'
import MUITextField, { TextFieldProps as MUITextFieldProps } from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

interface SelectOptions {
  label?: string
  key: string
}
export type SelectProps = MUITextFieldProps & {
  options: SelectOptions[]
}

const Select = ({ options, ...props }: SelectProps) => (
  <MUITextField {...props} select>
    {options?.map((i, index) => (
      <MenuItem {...i} key={i?.key || index}>
        {i.label}
      </MenuItem>
    ))}
  </MUITextField>
)

export default Select
