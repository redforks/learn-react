export type Product = {
  category: string
  price: string
  stocked: boolean
  name: string
}

const API_BASE = '/api/products'

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }
  return response.json()
}

export async function fetchProducts(
  searchParams?: URLSearchParams,
): Promise<Product[]> {
  const url = new URL(API_BASE, window.location.origin)
  if (searchParams) {
    url.search = searchParams.toString()
  }

  const response = await fetch(url.toString())
  return handleResponse<Product[]>(response)
}

export async function loader({
  request,
}: {
  request: Request
}): Promise<Product[]> {
  const { searchParams } = new URL(request.url)
  return fetchProducts(searchParams)
}
