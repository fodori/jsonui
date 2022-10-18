import React from 'react'
import MUISlider, { SliderProps as MUISliderPropsProps } from '@mui/material/Slider'

export type SliderProps = MUISliderPropsProps & {
  onChange: (value: any) => void
}

const Slider = (props: SliderProps) => <MUISlider {...props} onChange={(event: any, value) => props.onChange(value)} />

export default Slider
