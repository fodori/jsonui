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
  const { fieldErrors, validation, value, label, helperText, onChange, ...ownProps } = props
  const error = !!fieldErrors
  return (
    <>
      {label && <p style={{ fontSize: 20, color: error ? 'red' : undefined }}>{label}</p>}
      <input {...ownProps} value={value || ''} onChange={handleChange} />
      {(helperText || error) && <p style={{ fontSize: 10, color: error ? 'red' : undefined }}>{error ? convertErrorToString(fieldErrors) : helperText}</p>}
    </>
  )
}

export default Edit
