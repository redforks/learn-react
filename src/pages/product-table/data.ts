import ky from 'ky'

export type Product = {
  category: string
  price: string
  stocked: boolean
  name: string
}

const API_BASE = '/api/products'

const api = ky.create({ prefixUrl: API_BASE })

async function fetchProducts(
  searchParams?: URLSearchParams,
): Promise<Product[]> {
  return api.get('', { searchParams }).json<Product[]>()
}

export async function loader({
  request,
}: {
  request: Request
}): Promise<Product[]> {
  const { searchParams } = new URL(request.url)
  return fetchProducts(searchParams)
}
