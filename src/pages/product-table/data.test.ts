import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { loader } from './data'
import { resetProducts, server } from './mocks'

beforeAll(() => server.listen())

afterEach(() => {
  server.resetHandlers()
  resetProducts()
})

afterAll(() => server.close())

describe('loader', () => {
  it('returns all products when no search params', async () => {
    const products = await loader('')

    expect(products).toHaveLength(6)
    expect(products[0].name).toBe('Apple')
  })

  it('filters products by search term', async () => {
    const products = await loader('search=dragon')

    expect(products).toHaveLength(1)
    expect(products[0].name).toBe('Dragonfruit')
  })

  it('filters products by inStockOnly', async () => {
    const products = await loader('inStockOnly=true')

    expect(products).toHaveLength(4)
    expect(products.every((p) => p.stocked)).toBe(true)
  })

  it('filters products by both search and inStockOnly', async () => {
    const products = await loader('search=fruit&inStockOnly=true')

    // Dragonfruit is stocked and contains "fruit", Passionfruit contains "fruit" but is not stocked
    expect(products).toHaveLength(1)
    expect(products[0].name).toBe('Dragonfruit')
  })

  it('sorts products by category then by id', async () => {
    const products = await loader('')

    // Should be sorted by category first (Fruits before Vegetables), then by id
    expect(products.map((p) => `${p.category}:${p.id}`)).toEqual([
      'Fruits:1',
      'Fruits:2',
      'Fruits:3',
      'Vegetables:4',
      'Vegetables:5',
      'Vegetables:6',
    ])
  })
})
