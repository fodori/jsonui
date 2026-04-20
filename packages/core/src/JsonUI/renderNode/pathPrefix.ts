/** Segment-aware path overlap check (aligned with validation.ts). */
export function isPathPrefix(rulePath: string, targetPath: string): boolean {
  const r = rulePath === '' ? '/' : rulePath
  const t = targetPath === '' ? '/' : targetPath
  if (r === '/') return true
  if (t === r) return true
  return t.startsWith(r.endsWith('/') ? r : `${r}/`)
}
