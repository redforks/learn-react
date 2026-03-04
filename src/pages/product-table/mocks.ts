import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import type { Product, ProductInput } from './data'

let products: Product[] = [
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

function generateId(): string {
  return String(Date.now())
}

export function resetProducts(): void {
  products = [
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
    {
      id: '6',
      category: 'Vegetables',
      price: '1',
      stocked: true,
      name: 'Peas',
    },
  ]
}

export const handlers = [
  http.get('/api/products', ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search') ?? undefined
    const inStockOnly = url.searchParams.get('inStockOnly') === 'true'

    const filtered = filterProducts(products, search, inStockOnly)
    return HttpResponse.json(filtered)
  }),

  http.post('/api/products', async ({ request }) => {
    const input = (await request.json()) as ProductInput
    const newProduct: Product = {
      id: generateId(),
      ...input,
    }
    products.push(newProduct)
    return HttpResponse.json(newProduct, { status: 201 })
  }),

  http.put('/api/products/:id', async ({ params, request }) => {
    const { id } = params
    const input = (await request.json()) as Product
    const index = products.findIndex((p) => p.id === id)

    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }

    products[index] = input
    return HttpResponse.json(input)
  }),

  http.delete('/api/products/:id', ({ params }) => {
    const { id } = params
    const index = products.findIndex((p) => p.id === id)

    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }

    products.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]

export const server = setupServer(...handlers)
