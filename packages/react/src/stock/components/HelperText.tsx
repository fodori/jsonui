import React from 'react'

function UHelperText(props: any) {
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

export default UHelperText
