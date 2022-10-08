import React from 'react'
import MUITextField, { TextFieldProps as MUITextFieldProps } from '@mui/material/TextField'

export type TextFieldProps = MUITextFieldProps

const TextField = (props: TextFieldProps) => <MUITextField {...props} />

export default TextField
