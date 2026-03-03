import ky from 'ky'

export type Product = {
  category: string
  price: string
  stocked: boolean
  name: string
}

const api = ky.create({ prefixUrl: '/api/products' })

export async function loader({
  request,
}: {
  request: Request
}): Promise<Product[]> {
  const { searchParams } = new URL(request.url)
  return api.get('', { searchParams }).json<Product[]>()
}
