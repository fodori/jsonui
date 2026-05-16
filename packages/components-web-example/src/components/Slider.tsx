import React from 'react'
import MUISlider, { SliderProps as MUISliderPropsProps } from '@mui/material/Slider'

export type SliderProps = MUISliderPropsProps & {
  onChange: (value: any) => void
}

const Slider = (props: SliderProps) => {
  const changeHandler = props.onChange as React.ChangeEventHandler<HTMLInputElement> | undefined

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return <MUISlider {...props} onChange={changeHandler as any} />
}

export default Slider
