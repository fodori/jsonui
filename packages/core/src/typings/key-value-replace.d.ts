interface KeyValues {
  [key: string]: string | number | null | undefined | boolean
}

declare module 'key-value-replace' {
  function functionProps(str: string, obj: KeyValues, delimiter?: [prefix?: string, postfix?: string]): string
  export default functionProps
}
