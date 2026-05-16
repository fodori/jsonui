// @vitest-environment jsdom
// Required for React 18 act() to work in test environments
// See: https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#configuring-your-testing-environment
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true
