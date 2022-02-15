import React from 'react'
import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'

function CFormResult({ value }: { value: any }) {
  return (
    <>
      {value &&
        isArray(value) &&
        value
          .filter((i) => i !== undefined && i !== null)
          .map((k, i) => (
            <React.Fragment key={k}>
              <p style={{ fontSize: 16, fontWeight: 'bold' }}>
                {`${i} `}
                Result:
              </p>
              <p>{JSON.stringify(k)}</p>
            </React.Fragment>
          ))}
      {value &&
        !isArray(value) &&
        isObject(value) &&
        Object.keys(value).map((k) => (
          <React.Fragment key={k}>
            <p style={{ fontSize: 16, fontWeight: 'bold' }}>
              {`${k} `}
              Result:
            </p>
            <p>{JSON.stringify((value as unknown as any)[k])}</p>
          </React.Fragment>
        ))}
    </>
  )
}

export default CFormResult
