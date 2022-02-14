import React from 'react'

function CImage(props: any) {
  const { src } = props
  return <img alt="" {...props} src={src && src.uri ? src.uri : src} />
}

export default CImage
