import React from 'react'
import ViewerMobile, { ViewerProps } from './ViewerMobile'

type JsonUIProps = ViewerProps

const JsonUI = (props: JsonUIProps) => <ViewerMobile {...props} />

export { JsonUI }
export type { JsonUIProps }
