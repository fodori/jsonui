import { JsonUINode } from '@jsonui/core'
import React from 'react'

export const Slider = ({ value, onChange, onInput, min = 0, max = 100, step = 1, style, $ctx: _ctx, ...rest }: JsonUINode) => {
  const changeHandler = (onChange ?? onInput) as React.ChangeEventHandler<HTMLInputElement> | undefined

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
      }}
    >
      <input
        type="range"
        min={min as number}
        max={max as number}
        step={step as number}
        value={(value ?? 0) as number | string}
        onChange={changeHandler}
        style={style as React.CSSProperties}
        {...rest}
      />
      <div
        style={{
          fontSize: 11,
          marginTop: 4,
          textAlign: 'right',
          color: '#555',
        }}
      >
        {String(value ?? '')}
      </div>
    </div>
  )
}
