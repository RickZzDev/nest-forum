import { expect, test } from 'vitest'
import { Slug } from './slug'

test('Should be able to reate', () => {
  const slug = Slug.createFromText('Example question title')
  expect(slug.value).toEqual('example-question-title')
})
