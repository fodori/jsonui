import React from 'react'

function FormResult({ value }: { value: any }) {
  try {
    return <>{JSON.stringify(value)}</>
  } catch {
    return <>invalid JSON</>
  }
}

export default FormResult
