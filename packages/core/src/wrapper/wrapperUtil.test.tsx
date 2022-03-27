import * as w from './wrapperUtil'
const stock = test('actionBuilder test', () => {
  const props = { aaa: 3 }
  expect(w.actionBuilder(props)).toBe('{{')
})
