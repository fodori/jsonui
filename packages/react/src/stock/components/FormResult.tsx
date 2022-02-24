import React from 'react'
import { util } from '@jsonui/core'

function CFormResult({ value }: { value: any }) {
  return (
    <>
      {value &&
        Array.isArray(value) &&
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
        !Array.isArray(value) &&
        util.isOnlyObject(value) &&
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
