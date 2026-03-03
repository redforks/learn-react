import { defineMock, defineMockData } from 'vite-plugin-mock-dev-server'
import type { Product } from '../src/pages/product-table/types'

const PRODUCTS: Product[] = [
  { category: 'Fruits', price: '$1', stocked: true, name: 'Apple' },
  { category: 'Fruits', price: '$1', stocked: true, name: 'Dragonfruit' },
  { category: 'Fruits', price: '$2', stocked: false, name: 'Passionfruit' },
  { category: 'Vegetables', price: '$2', stocked: true, name: 'Spinach' },
  { category: 'Vegetables', price: '$4', stocked: false, name: 'Pumpkin' },
  { category: 'Vegetables', price: '$1', stocked: true, name: 'Peas' },
]

const products = defineMockData<Product[]>('products', [...PRODUCTS])

function filterProducts(
  productList: Product[],
  search?: string,
  inStockOnly?: boolean,
): Product[] {
  return productList.filter((p) => {
    if (inStockOnly && !p.stocked) {
      return false
    }

    if (search && p.name.toLowerCase().indexOf(search.toLowerCase()) === -1) {
      return false
    }
    return true
  })
}

export default defineMock([
  {
    url: '/api/products',
    method: 'GET',
    body: (request) => {
      const search = request.query.search as string | undefined
      const inStockOnly = request.query.inStockOnly === 'true'

      return filterProducts(products.value, search, inStockOnly)
    },
  },
])
