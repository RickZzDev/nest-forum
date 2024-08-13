import { Either, left, right } from './either'
import { test, expect } from 'vitest'

function doSomething(shouldSuccess: boolean): Either<string, string> {
  if (shouldSuccess) {
    return right('success')
  }
  return left('error')
}

test('Success result', () => {
  const success = doSomething(true)

  expect(success.isRight()).toBe(true)
})

test('Error result', () => {
  const error = doSomething(false)

  expect(error.isLeft()).toBe(true)
})
