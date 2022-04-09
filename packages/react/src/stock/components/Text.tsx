import React from 'react'

function Text(props: any) {
  return <p {...props}>{props.value || props.children}</p>
}

export default Text
