import React from 'react'
import MUICheckbox, { CheckboxProps as MUICheckboxProps } from '@mui/material/Checkbox'

export type CheckboxProps = MUICheckboxProps

const Checkbox = ({ onChange, ...props }: MUICheckboxProps & { onChange: any }) => {
  return <MUICheckbox {...props} onChange={onChange as React.ChangeEventHandler<HTMLInputElement>} />
}

export default Checkbox
