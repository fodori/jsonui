declare module '*.md' {
  const src: string
  export default src
}

declare module '*.md?raw' {
  const content: string
  export default content
}
