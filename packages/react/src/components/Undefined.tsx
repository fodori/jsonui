import React from 'react'

/**
 * Fallback when `$comp` is unknown (main JsonUI `_Undefined` parity).
 */
export function Undefined(props: Record<string, unknown> & { compName?: string }): React.ReactElement {
  const name = props.compName ?? (props.$comp as string | undefined) ?? 'unknown'
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
