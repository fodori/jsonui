/**
 * Style types for the shared style layer (web + React Native).
 * Canonical style is a subset of CSS-like keys that we support and map to both platforms.
 */

/** Supported style keys; values are number (px), string, or standard CSS values */
export type CanonicalStyle = Record<string, string | number | undefined>

/** Breakpoint keys for responsive style objects */
export type BreakpointKey = 'base' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Responsive style: base + optional overrides per breakpoint.
 * Resolver merges base with the current breakpoint's block (mobile-first).
 */
export interface ResponsiveStyle {
  base?: CanonicalStyle
  xs?: CanonicalStyle
  sm?: CanonicalStyle
  md?: CanonicalStyle
  lg?: CanonicalStyle
  xl?: CanonicalStyle
}

/** Input style can be a flat style object or a responsive object */
export type StyleInput = CanonicalStyle | ResponsiveStyle

/** Platform for style resolution */
export type StylePlatform = 'web' | 'native'

export interface ResolveStyleOptions {
  platform: StylePlatform
  breakpoint?: BreakpointKey
}

/** Default breakpoint width thresholds (min-width in px) */
export const DEFAULT_BREAKPOINTS: Record<BreakpointKey, number> = {
  base: 0,
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
}

/** Order for merging: base first, then xs..xl */
export const BREAKPOINT_ORDER: BreakpointKey[] = ['base', 'xs', 'sm', 'md', 'lg', 'xl']
