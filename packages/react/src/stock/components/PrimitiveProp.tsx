import React from 'react'
import { constants as c } from '@jsonui/core'

function PrimitiveProp({ children }: any) {
  return <span>{!c.SIMPLE_DATA_TYPES.includes(typeof children) || typeof children === 'boolean' ? JSON.stringify(children) : children}</span>
}

export default PrimitiveProp
