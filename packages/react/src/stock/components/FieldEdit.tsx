import React from 'react'

function CFieldEdit(props: any) {
  const handleChange = (event: any) => {
    props.onChange(event.target.value)
  }
  const { fieldErrors, validation, value, label, helperText: origHelpertext, ...ownProps } = props
  let error = !!fieldErrors
  let helperText = origHelpertext
  if (error && fieldErrors) {
    helperText = fieldErrors && Array.isArray(fieldErrors) ? fieldErrors.join(', ') : fieldErrors
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
      helperText = validation.fieldErrors && Array.isArray(validation.fieldErrors) ? validation.fieldErrors.join(', ') : validation.fieldErrors
    }
  }
  return (
    <>
      <p style={{ fontSize: 20, color: error ? 'red' : undefined }}>{label}</p>
      <input fullWidth {...ownProps} value={value || ''} onChange={handleChange} />
      <p style={{ fontSize: 10, color: error ? 'red' : undefined }}>{helperText}</p>
    </>
  )
}

export default CFieldEdit
