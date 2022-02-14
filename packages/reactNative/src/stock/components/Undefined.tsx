import React from 'react'
import { Text } from 'react-native'
import { getLabel } from './Label'

function Undefined(props: any) {
  return (
    <Text
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
    </Text>
  )
}

export default Undefined
