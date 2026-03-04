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

export async function action({
  request,
}: {
  request: Request
}): Promise<Response> {
  const formData = await request.formData()
  const intent = formData.get('_action')

  if (intent === 'create') {
    const product: ProductInput = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      price: formData.get('price') as string,
      stocked: formData.get('stocked') === 'true',
    }
    await api.post('', { json: product })
  } else if (intent === 'update') {
    const product: Product = {
      id: formData.get('id') as string,
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      price: formData.get('price') as string,
      stocked: formData.get('stocked') === 'true',
    }
    await api.put(product.id, { json: product })
  } else if (intent === 'delete') {
    await api.delete(formData.get('id') as string)
  }

  return new Response(null, { status: 302, headers: { Location: '.' } })
}
