/**
 * Resolves canonical or responsive style to platform-specific style (web or React Native).
 * Pure and synchronous; no dependencies.
 */

import { JSONParams } from '../util/types.js'
import type { CanonicalStyle, ResponsiveStyle, StyleInput, BreakpointKey, ResolveStyleOptions } from './types.js'
import { BREAKPOINT_ORDER } from './types.js'

const isResponsiveStyle = (style: StyleInput): style is ResponsiveStyle => {
  if (typeof style !== 'object' || Array.isArray(style)) return false
  const keys = Object.keys(style)
  return keys.some((k) => BREAKPOINT_ORDER.includes(k as BreakpointKey))
}

/**
 * Merge responsive style into a single style: base + all breakpoints up to and including current.
 * Mobile-first: current breakpoint index determines how many layers we merge.
 */
const mergeResponsive = (responsive: ResponsiveStyle, currentBreakpoint: BreakpointKey): CanonicalStyle => {
  const idx = BREAKPOINT_ORDER.indexOf(currentBreakpoint)
  const merged: CanonicalStyle = {}
  for (let i = 0; i <= idx; i++) {
    const key = BREAKPOINT_ORDER[i]
    const block = responsive[key]
    if (block && typeof block === 'object' && !Array.isArray(block)) {
      Object.assign(merged, block)
    }
  }
  return merged
}

/**
 * Parse "1px solid #ccc" or similar border shorthand into parts.
 */
const parseBorder = (
  value: string
): {
  width?: number
  style?: string
  color?: string
} => {
  const parts = value.trim().split(/\s+/)
  const result: { width?: number; style?: string; color?: string } = {}
  for (const p of parts) {
    if (/^\d+(\.\d+)?(px)?$/.test(p)) {
      result.width = parseFloat(p)
    } else if (['solid', 'dashed', 'dotted', 'none'].includes(p)) {
      result.style = p
    } else if (p.startsWith('#') || p.startsWith('rgb')) {
      result.color = p
    }
  }
  return result
}

/**
 * Convert canonical style to React Native-compatible style.
 * - border shorthand -> borderWidth, borderColor, borderStyle
 * - cursor is not supported on RN, omit
 * - numeric values kept as-is where RN expects numbers
 */
const toNativeStyle = (canonical: CanonicalStyle): JSONParams => {
  const out: JSONParams = {}
  for (const [key, value] of Object.entries(canonical)) {
    if (value === undefined) continue
    if (key === 'cursor') continue // not supported on RN
    if (key === 'border' && typeof value === 'string') {
      const { width, style, color } = parseBorder(value)
      if (width !== undefined) out.borderWidth = width
      if (style) out.borderStyle = style
      if (color) out.borderColor = color
      continue
    }
    if (key === 'borderRadius' && typeof value === 'number') {
      out.borderRadius = value
      continue
    }
    if ((key === 'borderTop' || key === 'borderBottom' || key === 'borderLeft' || key === 'borderRight') && typeof value === 'string') {
      const { width, style, color } = parseBorder(value)
      if (width !== undefined) out[`${key}Width`] = width
      if (style) out[`${key}Style`] = style
      if (color) out[`${key}Color`] = color
      continue
    }
    out[key] = value
  }
  return out
}

/**
 * Length-like style keys that need a unit (px) when the value is a bare number
 * or numeric string (e.g. from a store/modifier like sliderValue).
 */
const LENGTH_KEYS = new Set([
  'fontSize',
  'width',
  'height',
  'minWidth',
  'minHeight',
  'maxWidth',
  'maxHeight',
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'top',
  'right',
  'bottom',
  'left',
  'gap',
])

const ensureLengthUnit = (key: string, value?: string | number): string | number | undefined => {
  if (value === undefined) return value
  if (!LENGTH_KEYS.has(key)) return value
  if (typeof value === 'number') return `${value}px`
  if (typeof value === 'string' && /^\d+(\.\d+)?$/.test(value.trim())) {
    return `${value.trim()}px`
  }
  return value
}

/**
 * Web: pass through with minimal changes. Normalize length props (e.g. fontSize)
 * so numeric or numeric-string values get "px" and the browser applies them.
 */
const toWebStyle = (canonical: CanonicalStyle): JSONParams => {
  const out: JSONParams = {}
  for (const [key, value] of Object.entries(canonical)) {
    out[key] = ensureLengthUnit(key, value)
  }
  return out
}

/**
 * Resolve style input (canonical or responsive) to platform-specific style.
 * - If style is responsive (has base/xs/sm/md/lg/xl), merge up to current breakpoint, then resolve.
 * - If no breakpoint is provided for a responsive style, only "base" is used.
 */
export const resolveStyle = (style: StyleInput | null | undefined, options: ResolveStyleOptions): JSONParams | undefined => {
  if (!style || typeof style !== 'object') return undefined

  let canonical: CanonicalStyle

  if (isResponsiveStyle(style)) {
    const breakpoint = options.breakpoint ?? 'base'
    canonical = mergeResponsive(style, breakpoint)
  } else {
    canonical = style
  }

  if (Object.keys(canonical).length === 0) return undefined

  return options.platform === 'native' ? toNativeStyle(canonical) : toWebStyle(canonical)
}
