import { describe, expect, test } from 'vitest'
import { isDefined, isNotEmpty } from './utils'
test('isDefined', () => {
  expect(isDefined('')).toBe(true)
  expect(isDefined(null)).toBe(false)
  expect(isDefined({ hello: 'world' })).toBe(true)
})

describe('isNotEmpty', () => {
  test('empty string', () => {
    expect(isNotEmpty('')).toBe(false)
  })
  test('undefined', () => {
    expect(isNotEmpty(undefined)).toBe(false)
  })
  test('null', () => {
    expect(isNotEmpty(null)).toBe(false)
  })
  test('empty array', () => {
    expect(isNotEmpty([])).toBe(false)
  })
  test('empty object', () => {
    expect(isNotEmpty({})).toBe(false)
  })
})
