import React from 'react'
import { Text } from 'react-native'

function CText(props: any) {
  return <Text {...props}>{props.value || props.children}</Text>
}

export default CText
