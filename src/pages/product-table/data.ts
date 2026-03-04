import ky from 'ky'

export type Product = {
  id: string
  category: string
  price: string
  stocked: boolean
  name: string
}

export type ProductInput = Omit<Product, 'id'>

const api = ky.create({ prefixUrl: '/api/products' })

export async function loader({
  request,
}: {
  request: Request
}): Promise<Product[]> {
  const { searchParams } = new URL(request.url)
  return api.get('', { searchParams }).json<Product[]>()
}

export async function createProduct(product: ProductInput): Promise<Product> {
  return api.post('', { json: product }).json<Product>()
}

export async function updateProduct(product: Product): Promise<Product> {
  return api.put(product.id, { json: product }).json<Product>()
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(id)
}
