import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { action, loader } from './data'
import { resetProducts, server } from './mocks'

beforeAll(() => server.listen())

afterEach(() => {
  server.resetHandlers()
  resetProducts()
})

afterAll(() => server.close())

describe('loader', () => {
  it('returns all products when no search params', async () => {
    const response = await loader({ request: new Request('http://localhost/') })
    const products = await response

    expect(products).toHaveLength(6)
    expect(products[0].name).toBe('Apple')
  })

  it('filters products by search term', async () => {
    const response = await loader({
      request: new Request('http://localhost/?search=dragon'),
    })
    const products = await response

    expect(products).toHaveLength(1)
    expect(products[0].name).toBe('Dragonfruit')
  })

  it('filters products by inStockOnly', async () => {
    const response = await loader({
      request: new Request('http://localhost/?inStockOnly=true'),
    })
    const products = await response

    expect(products).toHaveLength(4)
    expect(products.every((p) => p.stocked)).toBe(true)
  })

  it('filters products by both search and inStockOnly', async () => {
    const response = await loader({
      request: new Request('http://localhost/?search=fruit&inStockOnly=true'),
    })
    const products = await response

    // Dragonfruit is stocked and contains "fruit", Passionfruit contains "fruit" but is not stocked
    expect(products).toHaveLength(1)
    expect(products[0].name).toBe('Dragonfruit')
  })
})

describe('action', () => {
  it('creates a new product', async () => {
    const formData = new FormData()
    formData.set('_action', 'create')
    formData.set('name', 'Mango')
    formData.set('category', 'Fruits')
    formData.set('price', '$3')
    formData.set('stocked', 'on') // checkbox uses "on" for checked

    const response = await action({
      request: new Request('http://localhost/', {
        method: 'POST',
        body: formData,
      }),
    })

    expect(response.status).toBe(302)
    expect(response.headers.get('Location')).toBe('.')

    // Verify product was created
    const products = await loader({ request: new Request('http://localhost/') })
    expect(products).toHaveLength(7)
    const mango = products.find((p) => p.name === 'Mango')
    expect(mango).toBeDefined()
    expect(mango?.stocked).toBe(true)
  })

  it('updates an existing product', async () => {
    const formData = new FormData()
    formData.set('_action', 'update')
    formData.set('id', '1')
    formData.set('name', 'Green Apple')
    formData.set('category', 'Fruits')
    formData.set('price', '$2')
    // Don't set stocked to test unchecked checkbox behavior

    const response = await action({
      request: new Request('http://localhost/', {
        method: 'POST',
        body: formData,
      }),
    })

    expect(response.status).toBe(302)
    expect(response.headers.get('Location')).toBe('.')

    // Verify product was updated
    const products = await loader({ request: new Request('http://localhost/') })
    const updated = products.find((p) => p.id === '1')
    expect(updated?.name).toBe('Green Apple')
    expect(updated?.price).toBe('$2')
    expect(updated?.stocked).toBe(false)
  })

  it('deletes a product', async () => {
    const formData = new FormData()
    formData.set('_action', 'delete')
    formData.set('id', '1')

    const response = await action({
      request: new Request('http://localhost/', {
        method: 'POST',
        body: formData,
      }),
    })

    expect(response.status).toBe(302)
    expect(response.headers.get('Location')).toBe('.')

    // Verify product was deleted
    const products = await loader({ request: new Request('http://localhost/') })
    expect(products).toHaveLength(5)
    expect(products.some((p) => p.id === '1')).toBe(false)
  })

  it('returns redirect for unknown action', async () => {
    const formData = new FormData()
    formData.set('_action', 'unknown')

    const response = await action({
      request: new Request('http://localhost/', {
        method: 'POST',
        body: formData,
      }),
    })

    expect(response.status).toBe(302)
    expect(response.headers.get('Location')).toBe('.')
  })
})
