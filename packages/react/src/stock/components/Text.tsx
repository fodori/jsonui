import React from 'react'

function CText(props: any) {
  return <p {...props}>{props.value || props.children}</p>
}

export default CText
