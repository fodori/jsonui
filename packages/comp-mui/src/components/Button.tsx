import React from 'react'

export type ButtonProps = any

function Button(props: ButtonProps) {
  // eslint-disable-next-line react/button-has-type
  return <button {...props} />
}

export default Button
