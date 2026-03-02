import { loader, PRODUCTS } from './data'

describe('PRODUCTS', () => {
  it('contains all expected products', () => {
    expect(PRODUCTS).toHaveLength(6)
    expect(PRODUCTS).toContainEqual({
      category: 'Fruits',
      price: '$1',
      stocked: true,
      name: 'Apple',
    })
    expect(PRODUCTS).toContainEqual({
      category: 'Vegetables',
      price: '$1',
      stocked: true,
      name: 'Peas',
    })
  })
})

describe('loader', () => {
  it('returns all products when no filters are applied', () => {
    const request = new Request('http://localhost/')
    const result = loader({ request })

    expect(result).toHaveLength(6)
  })

  it('filters products by search text (case insensitive)', () => {
    const request = new Request('http://localhost/?search=apple')
    const result = loader({ request })

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      category: 'Fruits',
      price: '$1',
      stocked: true,
      name: 'Apple',
    })
  })

  it('filters products by search text with uppercase input', () => {
    const request = new Request('http://localhost/?search=DRAGON')
    const result = loader({ request })

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Dragonfruit')
  })

  it('filters products by search text with partial match', () => {
    const request = new Request('http://localhost/?search=fruit')
    const result = loader({ request })

    expect(result).toHaveLength(2)
    expect(result.map((p) => p.name)).toEqual(['Dragonfruit', 'Passionfruit'])
  })

  it('filters to show only in-stock products when inStockOnly is true', () => {
    const request = new Request('http://localhost/?inStockOnly=true')
    const result = loader({ request })

    expect(result).toHaveLength(4)
    expect(result.every((p) => p.stocked)).toBe(true)
    expect(result.map((p) => p.name)).toEqual([
      'Apple',
      'Dragonfruit',
      'Spinach',
      'Peas',
    ])
  })

  it('combines search and in-stock filters', () => {
    const request = new Request(
      'http://localhost/?search=fruit&inStockOnly=true',
    )
    const result = loader({ request })

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Dragonfruit')
  })

  it('returns empty array when filter matches nothing', () => {
    const request = new Request('http://localhost/?search=nonexistent')
    const result = loader({ request })

    expect(result).toHaveLength(0)
  })

  it('preserves category grouping when filtering', () => {
    const request = new Request('http://localhost/?inStockOnly=true')
    const result = loader({ request })

    const categories = result.map((p) => p.category)
    expect(categories).toContain('Fruits')
    expect(categories).toContain('Vegetables')
  })
})
