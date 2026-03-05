import ky from 'ky'
import { z } from 'zod'
import { zfd } from 'zod-form-data'

export enum Intent {
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}

export const baseProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  price: z.string().regex(/^\d+(\.\d+)?$/, 'Price must be a valid decimal'),
  stocked: z.boolean(),
})

export const createSchema = zfd.formData(
  z.object({
    name: zfd.text(baseProductSchema.shape.name),
    category: zfd.text(baseProductSchema.shape.category),
    price: zfd.text(baseProductSchema.shape.price),
    stocked: zfd.checkbox(),
  }),
)

export const updateSchema = zfd.formData(
  z.object({
    name: zfd.text(baseProductSchema.shape.name),
    category: zfd.text(baseProductSchema.shape.category),
    price: zfd.text(baseProductSchema.shape.price),
    stocked: zfd.checkbox(),
    id: zfd.text(),
  }),
)

export const deleteSchema = zfd.formData({
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
  const products = await api.get('', { searchParams }).json<Product[]>()
  return products.sort(
    (a, b) => a.category.localeCompare(b.category) || a.id.localeCompare(b.id),
  )
}

export async function action({
  request,
}: {
  request: Request
}): Promise<Response> {
  const formData = await request.formData()
  const intent = formData.get('intent')

  if (intent === Intent.Create) {
    const product = createSchema.parse(formData)
    await api.post('', { json: product })
  } else if (intent === Intent.Update) {
    const product = updateSchema.parse(formData)
    await api.put(product.id, { json: product })
  } else if (intent === Intent.Delete) {
    const { id } = deleteSchema.parse(formData)
    await api.delete(id)
  }

  return Response.json({ success: true })
}
