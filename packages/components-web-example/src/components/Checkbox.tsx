import React from 'react'
import MUICheckbox, { CheckboxProps as MUICheckboxProps } from '@mui/material/Checkbox'

export type CheckboxProps = MUICheckboxProps

const Checkbox = ({ onChange, ...props }: MUICheckboxProps & { onChange: any }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event?.target?.checked)
  }

  return <MUICheckbox {...props} onChange={handleChange} />
}

export default Checkbox
