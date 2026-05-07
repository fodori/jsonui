import { useState, useEffect } from 'react'
import type { BreakpointKey } from '@jsonui/core'
import { DEFAULT_BREAKPOINTS, BREAKPOINT_ORDER } from '@jsonui/core'

export type GetWidth = () => number

const defaultGetWidth: GetWidth = () => (typeof window !== 'undefined' ? window.innerWidth : 1024)

/**
 * Get current breakpoint key from viewport width (mobile-first).
 * Uses the largest breakpoint whose threshold is <= width.
 */
const getBreakpointFromWidth = (width: number, breakpoints: Record<BreakpointKey, number>): BreakpointKey => {
  let current: BreakpointKey = 'base'
  for (const key of BREAKPOINT_ORDER) {
    const threshold = breakpoints[key]
    if (width >= threshold) {
      current = key
    }
  }
  return current
}

export interface UseBreakpointOptions {
  getWidth?: GetWidth
  breakpoints?: Record<BreakpointKey, number>
}

/**
 * Returns the current breakpoint based on viewport width.
 * On web, use default getWidth (window.innerWidth).
 * On React Native, pass getWidth: () => Dimensions.get('window').width.
 */
export const useBreakpoint = (options: UseBreakpointOptions = {}): BreakpointKey => {
  const { getWidth = defaultGetWidth, breakpoints = DEFAULT_BREAKPOINTS } = options

  const [breakpoint, setBreakpoint] = useState<BreakpointKey>(() => getBreakpointFromWidth(getWidth(), breakpoints))

  useEffect(() => {
    const update = () => {
      setBreakpoint((prev: BreakpointKey) => {
        const next = getBreakpointFromWidth(getWidth(), breakpoints)
        return next !== prev ? next : prev
      })
    }
    update()
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', update)
      return () => window.removeEventListener('resize', update)
    }
  }, [getWidth, breakpoints])

  return breakpoint
}
