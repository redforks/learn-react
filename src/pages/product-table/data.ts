import ky from 'ky'
import { zfd } from 'zod-form-data'

const baseProductSchema = {
  name: zfd.text(),
  category: zfd.text(),
  price: zfd.text(),
  stocked: zfd.checkbox(),
}

const createSchema = zfd.formData(baseProductSchema)

const updateSchema = zfd.formData({
  ...baseProductSchema,
  id: zfd.text(),
})

const deleteSchema = zfd.formData({
  id: zfd.text(),
})

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
    const product = createSchema.parse(formData)
    await api.post('', { json: product })
  } else if (intent === 'update') {
    const product = updateSchema.parse(formData)
    await api.put(product.id, { json: product })
  } else if (intent === 'delete') {
    const { id } = deleteSchema.parse(formData)
    await api.delete(id)
  }

  return new Response(null, { status: 302, headers: { Location: '.' } })
}
