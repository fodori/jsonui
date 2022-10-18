import React from 'react'

export type TextProps = any
function Text(props: TextProps) {
  return <p {...props}>{props.value || props.children}</p>
}

export default Text
