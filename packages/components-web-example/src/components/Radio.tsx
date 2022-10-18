import React from 'react'
import MUIRadio, { RadioProps as MUIRadioProps } from '@mui/material/Radio'

export type RadioProps = MUIRadioProps

const Radio = (props: RadioProps) => <MUIRadio {...props} />

export default Radio
