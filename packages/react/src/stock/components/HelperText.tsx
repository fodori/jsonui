import React from 'react'
import isArray from 'lodash/isArray'

function UHelperText(props: any) {
  const { helperText, fieldError, fieldErrors, propsHelperText } = props
  if (helperText || fieldError) {
    return (
      <p {...propsHelperText}>
        {
          // eslint-disable-next-line no-nested-ternary
          fieldError ? (isArray(fieldErrors) ? fieldErrors.join(',') : fieldErrors) : helperText
        }
      </p>
    )
  }
  return null
}

export default UHelperText
