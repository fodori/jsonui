import { JSONParams } from '../util/types'

export async function jsonata(params: JSONParams): Promise<unknown> {
  const { jsonataDef, ...input } = params as {
    jsonataDef?: unknown
    [key: string]: unknown
  }
  if (typeof jsonataDef !== 'string' || !jsonataDef) return undefined

  try {
    const jsonata = (await import('jsonata')).default
    const expr = jsonata(jsonataDef)
    // Evaluate with the remaining params (e.g. { error, touched }) as input.
    return await expr.evaluate(input)
  } catch {
    // On any jsonata error, fall back to undefined so UI doesn't break.
    return undefined
  }
}
