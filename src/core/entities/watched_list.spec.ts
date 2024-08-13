import { WatchedList } from './watched_list'
import { describe, it, expect } from 'vitest'

class NumberWathcedList extends WatchedList<number> {
  compareItems(a: number, b: number): boolean {
    return a === b
  }
}

describe('Wattched list', () => {
  it('Should be able to create a watched list with inicial items', () => {
    const list = new NumberWathcedList([1, 2, 3])

    expect(list.currentItems).toHaveLength(3)
  })

  it('Should be able to add new items', () => {
    const list = new NumberWathcedList([1, 2, 3])
    list.add(4)

    expect(list.currentItems).toHaveLength(4)
    expect(list.getNewItems()).toEqual([4])
  })

  it('Should be able to remove items', () => {
    const list = new NumberWathcedList([1, 2, 3])
    list.remove(2)

    expect(list.currentItems).toHaveLength(2)
    expect(list.getRemovedItems()).toEqual([2])
  })

  it('Should be able to add item even if it was removed before', () => {
    const list = new NumberWathcedList([1, 2, 3])
    list.remove(2)
    list.add(2)

    expect(list.currentItems).toHaveLength(3)
    expect(list.getNewItems()).toEqual([])
  })

  it('Should be able to add item even if it was added before', () => {
    const list = new NumberWathcedList([1, 2, 3])
    list.add(4)
    list.remove(4)

    expect(list.currentItems).toHaveLength(3)
    expect(list.getNewItems()).toEqual([])
  })

  it('Should be able to update items', () => {
    const list = new NumberWathcedList([1, 2, 3])
    list.update([1, 3, 5])

    expect(list.getRemovedItems()).toEqual([2])
    expect(list.getNewItems()).toEqual([5])
  })
})
