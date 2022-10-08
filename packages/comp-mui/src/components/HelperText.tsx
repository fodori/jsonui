import React from 'react'

export type HelperTextProps = any
function HelperText(props: HelperTextProps) {
  const { helperText, fieldError, fieldErrors, propsHelperText } = props
  if (helperText || fieldError) {
    return (
      <p {...propsHelperText}>
        {
          // eslint-disable-next-line no-nested-ternary
          fieldError ? (Array.isArray(fieldErrors) ? fieldErrors.join(',') : fieldErrors) : helperText
        }
      </p>
    )
  }
  return null
}

export default HelperText
