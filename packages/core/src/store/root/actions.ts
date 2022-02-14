export const DATA_UPDATE = 'DATA_UPDATE'
export const PURGE = 'PURGE'

export const set = (payload: any) => ({
  type: DATA_UPDATE,
  payload,
})

export const purge = (payload: any) => ({
  type: PURGE,
  payload,
})
