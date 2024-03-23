import React from 'react'

function Text({ value, children, ...props }: any) {
  return <p {...props}>{value || children}</p>
}

export default Text
