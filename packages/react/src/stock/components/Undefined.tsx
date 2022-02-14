import React from 'react'
import { getLabel } from './Label'

function Undefined(props: any) {
  return (
    <p
      style={{
        flex: 1,
        minWidth: 100,
        minHeight: 20,
        marginTop: 5,
        borderColor: 'yellow',
        borderWidth: 2,
      }}
    >
      {getLabel(props)}
    </p>
  )
}

export default Undefined
