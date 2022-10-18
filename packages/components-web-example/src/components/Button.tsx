import React from 'react'
import MUIButton, { ButtonProps as MUIButtonProps } from '@mui/material/Button'

export type ButtonProps = MUIButtonProps

const Button = (props: ButtonProps) => <MUIButton {...props} />

export default Button
