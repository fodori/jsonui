import React from 'react'
import isArray from 'lodash/isArray'
import { Text } from 'react-native'

function UHelperText(props: any) {
  const { helperText, fieldError, fieldErrors, propsHelperText } = props
  if (helperText || fieldError) {
    return (
      <Text {...propsHelperText}>
        {
          // eslint-disable-next-line no-nested-ternary
          fieldError ? (isArray(fieldErrors) ? fieldErrors.join(',') : fieldErrors) : helperText
        }
      </Text>
    )
  }
  return null
}

export default UHelperText
