import { defineMock, defineMockData } from 'vite-plugin-mock-dev-server'
import type { Product, ProductInput } from '../src/pages/product-table/data'

const PRODUCTS: Product[] = [
  { id: '1', category: 'Fruits', price: '1', stocked: true, name: 'Apple' },
  {
    id: '2',
    category: 'Fruits',
    price: '1',
    stocked: true,
    name: 'Dragonfruit',
  },
  {
    id: '3',
    category: 'Fruits',
    price: '2',
    stocked: false,
    name: 'Passionfruit',
  },
  {
    id: '4',
    category: 'Vegetables',
    price: '2',
    stocked: true,
    name: 'Spinach',
  },
  {
    id: '5',
    category: 'Vegetables',
    price: '4',
    stocked: false,
    name: 'Pumpkin',
  },
  { id: '6', category: 'Vegetables', price: '1', stocked: true, name: 'Peas' },
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
  {
    url: '/api/products',
    method: 'POST',
    body: (request) => {
      const input = request.body as ProductInput
      const newProduct: Product = {
        ...input,
        id: crypto.randomUUID(),
      }
      products.value.push(newProduct)
      return newProduct
    },
  },
  {
    url: '/api/products/:id',
    method: 'PUT',
    body: (request) => {
      const { id } = request.params
      const input = request.body as ProductInput
      const index = products.value.findIndex((p) => p.id === id)
      if (index === -1) {
        return { status: 404, body: { error: 'Product not found' } }
      }
      products.value[index] = { ...input, id }
      return products.value[index]
    },
  },
  {
    url: '/api/products/:id',
    method: 'DELETE',
    body: (request) => {
      const { id } = request.params
      const index = products.value.findIndex((p) => p.id === id)
      if (index !== -1) {
        products.value.splice(index, 1)
      }
      return { status: 204 }
    },
  },
])
