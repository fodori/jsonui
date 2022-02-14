import React from 'react'
import ViewerWeb, { ViewerProps } from './ViewerWeb'

type JsonUIProps = ViewerProps

const JsonUI = (props: JsonUIProps) => <ViewerWeb {...props} />

export { JsonUI }
export type { JsonUIProps }
