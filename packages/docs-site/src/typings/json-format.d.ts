interface Config {
  tab?: { size?: number }
  space?: { size?: number }
  type?: 'tab' | 'space'
}

declare module 'json-format' {
  function functionProps(str: any, config: Config): string
  export default functionProps
}
