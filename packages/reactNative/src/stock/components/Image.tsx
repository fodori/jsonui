import React from 'react'
import { Image } from 'react-native'

function CImage(props: any) {
  const { src } = props
  return (
    <Image
      alt=""
      {...props}
      source={{
        uri: src && src.uri ? src.uri : src,
      }}
    />
  )
}

export default CImage
