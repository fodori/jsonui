import React from 'react'
import MUICheckbox, { CheckboxProps as MUICheckboxProps } from '@mui/material/Checkbox'

export type CheckboxProps = MUICheckboxProps

const Checkbox = (props: CheckboxProps) => <MUICheckbox {...props} />

export default Checkbox
