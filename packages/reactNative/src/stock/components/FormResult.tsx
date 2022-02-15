import React from 'react'
import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'
import { Text } from 'react-native'

function CFormResult({ value }: { value: any }) {
  return (
    <>
      {value &&
        isArray(value) &&
        value
          .filter((i) => i !== undefined && i !== null)
          .map((k, i) => (
            <React.Fragment key={k}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                {`${i} `}
                Result:
              </Text>
              <Text>{JSON.stringify(k)}</Text>
            </React.Fragment>
          ))}
      {value &&
        !isArray(value) &&
        isObject(value) &&
        Object.keys(value).map((k) => (
          <React.Fragment key={k}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
              {`${k} `}
              Result:
            </Text>
            <Text>{JSON.stringify((value as unknown as any)[k])}</Text>
          </React.Fragment>
        ))}
    </>
  )
}

export default CFormResult
