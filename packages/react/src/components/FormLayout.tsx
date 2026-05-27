import { JsonUINode } from '@jsonui/core'
import React from 'react'

export const FormLayout = ({ children, childTop, childBottom, style, $ctx: _ctx, ...rest }: JsonUINode) => {
  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: 6,
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        ...(style as React.CSSProperties),
      }}
      {...rest}
    >
      {childTop ? (
        <div
          style={{
            borderBottom: '1px solid #eee',
            paddingBottom: 8,
            marginBottom: 4,
          }}
        >
          {childTop as React.ReactNode}
        </div>
      ) : null}
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
        onSubmit={(e) => {
          // SubmitButton handles its own click + submit logic; prevent the
          // native form submission from reloading the page.
          e.preventDefault()
        }}
      >
        <div
          style={{
            border: '1px dashed #ddd',
            padding: 8,
          }}
        >
          {children as React.ReactNode}
        </div>
        {childBottom ? (
          <div
            style={{
              borderTop: '1px solid #eee',
              paddingTop: 8,
              marginTop: 4,
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            {childBottom as React.ReactNode}
          </div>
        ) : null}
      </form>
    </div>
  )
}
