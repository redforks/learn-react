import { fetchProducts } from './api'
import type { Product } from './types'

export type { Product }

export async function loader({
  request,
}: {
  request: Request
}): Promise<Product[]> {
  const url = new URL(request.url)
  const search = url.searchParams.get('search') ?? undefined
  const inStockOnly = url.searchParams.get('inStockOnly') === 'true'

  return fetchProducts({ search, inStockOnly })
}
