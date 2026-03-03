import type { Product } from './types'

const API_BASE = '/api/products'

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }
  return response.json()
}

export async function fetchProducts(params?: {
  search?: string
  inStockOnly?: boolean
}): Promise<Product[]> {
  const url = new URL(API_BASE, window.location.origin)
  if (params?.search) {
    url.searchParams.set('search', params.search)
  }
  if (params?.inStockOnly) {
    url.searchParams.set('inStockOnly', 'true')
  }

  const response = await fetch(url.toString())
  return handleResponse<Product[]>(response)
}
