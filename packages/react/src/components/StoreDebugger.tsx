import { JsonUINode } from '@jsonui/core'
import React from 'react'

export const StoreDebugger = ({ data, error, touched }: JsonUINode) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 8,
        fontFamily: 'monospace',
        fontSize: 11,
        background: '#f5f5f5',
        padding: 8,
        borderRadius: 4,
        overflowX: 'auto',
      }}
    >
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: 4 }}>data</div>
        <pre style={{ margin: 0 }}>{JSON.stringify(data, null, 2)}</pre>
      </div>
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: 4 }}>error</div>
        <pre style={{ margin: 0 }}>{JSON.stringify(error, null, 2)}</pre>
      </div>
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: 4 }}>touched</div>
        <pre style={{ margin: 0 }}>{JSON.stringify(touched, null, 2)}</pre>
      </div>
    </div>
  )
}
