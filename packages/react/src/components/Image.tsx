import React from 'react'

export function Image({ src, alt, style, ...rest }: Record<string, unknown>) {
  return <img src={src as string} alt={alt != null ? String(alt) : ''} style={style as React.CSSProperties} {...rest} />
}
