import type { ActionContext } from '../types.js'
import { getRootStore } from '../store.js'
import { ERROR_STORE_SUFFIX } from '../types.js'

export function submit(params: Record<string, unknown>, ctx: ActionContext): void {
  console.log('Submit clicked', ctx.componentProps.value)
}

export function submitErrors(params: Record<string, unknown>, ctx: ActionContext): void {
  const storeName = params.store as string | undefined
  const path = (params.path as string | undefined) ?? '/'
  if (!storeName) {
    alert('submitErrors requires a store name (e.g. { "store": "myStore" })')
    return
  }
  const root = getRootStore(ctx.stores)
  const errorsAtPath = root.getForStore(`${storeName}${ERROR_STORE_SUFFIX}`, path)
  alert(`${storeName}${ERROR_STORE_SUFFIX} at ${path} = ${JSON.stringify(errorsAtPath, null, 2)}`)
}
// TODO?????? delete it
export function submitWithPayload(params: Record<string, unknown>): void {
  console.log('Submit with payload:', params)
}
