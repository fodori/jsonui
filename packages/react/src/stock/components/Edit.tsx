import React from 'react'

const convertErrorToString = (fieldErrors: any): string => {
  if (typeof fieldErrors === 'string' || typeof fieldErrors === 'number') return `${fieldErrors}`
  if (fieldErrors && Array.isArray(fieldErrors)) {
    // eslint-disable-next-line no-nested-ternary
    return fieldErrors.map((i) => (typeof i === 'string' ? i : i?.['-'] ? i?.['-'] : JSON.stringify(i))).join(', ')
  }
  // eslint-disable-next-line no-nested-ternary
  return typeof fieldErrors === 'string' ? fieldErrors : fieldErrors?.['-'] ? fieldErrors?.['-'] : JSON.stringify(fieldErrors)
}

function Edit(props: any) {
  const handleChange = (event: any) => {
    props?.onChange(event.target.value)
  }
  const { fieldErrors, validation, value, label, helperText: origHelpertext, onChange, ...ownProps } = props
  let error = !!fieldErrors
  let helperText = origHelpertext
  if (error && fieldErrors) {
    helperText = convertErrorToString(fieldErrors)
  }
  if (validation && value && validation.jsonataDef) {
    let isValid = true
    try {
      // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
      const jsonata = require('jsonata')
      const expression = jsonata(validation.jsonataDef)
      isValid = expression.evaluate(value)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('jsonata error', validation.jsonataDef, err)
      isValid = false
    }
    if (!isValid) {
      error = true
      helperText = convertErrorToString(validation.message)
    }
  }
  return (
    <>
      {label && <p style={{ fontSize: 20, color: error ? 'red' : undefined }}>{label}</p>}
      <input {...ownProps} value={value || ''} onChange={handleChange} />
      {(helperText || error) && <p style={{ fontSize: 10, color: error ? 'red' : undefined }}>{helperText}</p>}
    </>
  )
}

export default Edit
