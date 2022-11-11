import React from 'react'
import MUISwitch, { SwitchProps as MUISwitchProps } from '@mui/material/Switch'

export type SwitchProps = MUISwitchProps

const Switch = (props: SwitchProps) => <MUISwitch {...props} />

export default Switch
