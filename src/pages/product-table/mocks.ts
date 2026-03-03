import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import type { Product } from './data'

const PRODUCTS: Product[] = [
  { category: 'Fruits', price: '$1', stocked: true, name: 'Apple' },
  { category: 'Fruits', price: '$1', stocked: true, name: 'Dragonfruit' },
  { category: 'Fruits', price: '$2', stocked: false, name: 'Passionfruit' },
  { category: 'Vegetables', price: '$2', stocked: true, name: 'Spinach' },
  { category: 'Vegetables', price: '$4', stocked: false, name: 'Pumpkin' },
  { category: 'Vegetables', price: '$1', stocked: true, name: 'Peas' },
]

function filterProducts(
  products: Product[],
  search?: string,
  inStockOnly?: boolean,
): Product[] {
  return products.filter((p) => {
    if (inStockOnly && !p.stocked) {
      return false
    }

    if (search && p.name.toLowerCase().indexOf(search.toLowerCase()) === -1) {
      return false
    }
    return true
  })
}

export const handlers = [
  http.get('/api/products', ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search') ?? undefined
    const inStockOnly = url.searchParams.get('inStockOnly') === 'true'

    const filtered = filterProducts(PRODUCTS, search, inStockOnly)
    return HttpResponse.json(filtered)
  }),
]

export const server = setupServer(...handlers)
