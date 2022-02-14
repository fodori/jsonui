import React from 'react'
import { constants as c } from '@jsonui/core'
import { Text } from 'react-native'

function Primitive({ children }: { children: any }) {
  return <Text>{!c.SIMPLE_DATA_TYPES.includes(typeof children) || typeof children === 'boolean' ? JSON.stringify(children) : children}</Text>
}

export default Primitive
