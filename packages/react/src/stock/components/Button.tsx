import React from 'react'

function Button({ children, type, ...props }: any) {
  return (
    <button type="button" {...props}>
      {children}
    </button>
  )
}

export default Button
