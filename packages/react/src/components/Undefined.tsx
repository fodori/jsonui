import { JsonUINode } from '@jsonui/core'
import React from 'react'

/**
 * Fallback when `$comp` is unknown (main JsonUI `_Undefined` parity).
 */
export const Undefined = (props: JsonUINode & { compName?: string }): React.ReactElement => {
  const name = props.compName ?? props.$comp ?? 'unknown'
  // TODO need better style
  return (
    <p
      style={{
        flex: 1,
        minWidth: 100,
        minHeight: 20,
        marginTop: 5,
        border: '2px solid #eab308',
        padding: 8,
        fontSize: 12,
      }}
    >
      Unknown component: <strong>{String(name)}</strong>
    </p>
  )
}
