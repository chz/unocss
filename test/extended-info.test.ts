import { createGenerator } from '@unocss/core'
import { expect, test } from 'vitest'

test('extended-info', async () => {
  const uno = createGenerator({
    rules: [
      ['a', { name: 'bar1' }, { layer: 'a' }],
      ['b', { name: 'bar2' }, { layer: 'b' }],
      [/^c(\d+)$/, ([, d]) => ({ name: d }), { layer: 'c' }],
      [/^d(\d+)$/, ([, d]) => `/* RAW ${d} */`, { layer: 'd' }],
    ],
    envMode: 'dev',
  })
  const { matched: notExtended } = await uno.generate('a b b c1', { preflights: false })
  const { matched: extended } = await uno.generate('a b b c1', { preflights: false, extendedInfo: true })

  expect(notExtended).toBeInstanceOf(Set)
  expect(extended).toBeInstanceOf(Map)

  expect(extended.get('a')?.count).toBe(1)
  expect(extended.get('b')?.count).toBe(2)

  expect(extended).toMatchSnapshot()
})
