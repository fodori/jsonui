import React, { createContext, useContext, useMemo } from 'react'
import type { StylePlatform, BreakpointKey } from '@jsonui/core'
import { DEFAULT_BREAKPOINTS } from '@jsonui/core'
import { useBreakpoint, type GetWidth } from './useBreakpoint.js'

export interface StyleConfigValue {
  platform: StylePlatform
  breakpoint: BreakpointKey
}

const defaultConfig: StyleConfigValue = {
  platform: 'web',
  breakpoint: 'md',
}

const StyleContext = createContext<StyleConfigValue>(defaultConfig)

export interface StyleProviderProps {
  children: React.ReactNode
  platform?: StylePlatform
  /** If not provided, breakpoint is computed from viewport width (web) or Dimensions (RN via getWidth). */
  breakpoint?: BreakpointKey
  /** For React Native: () => Dimensions.get('window').width */
  getWidth?: GetWidth
  breakpoints?: Record<BreakpointKey, number>
}

/**
 * Provides platform and breakpoint to the style layer.
 * Wrap your app or JsonUI tree with this to enable responsive and platform-specific style resolution.
 */
export function StyleProvider({
  children,
  platform = 'web',
  breakpoint: breakpointProp,
  getWidth,
  breakpoints = DEFAULT_BREAKPOINTS,
}: StyleProviderProps): React.ReactElement {
  const breakpointFromHook = useBreakpoint(breakpointProp === undefined ? { getWidth, breakpoints } : {})
  const breakpoint = breakpointProp ?? breakpointFromHook

  const value = useMemo<StyleConfigValue>(() => ({ platform, breakpoint }), [platform, breakpoint])

  return <StyleContext.Provider value={value}>{children}</StyleContext.Provider>
}

export function useStyleConfig(): StyleConfigValue {
  return useContext(StyleContext) ?? defaultConfig
}
