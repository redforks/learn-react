import ky from 'ky'
import { z } from 'zod'
import { zfd } from 'zod-form-data'

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

export async function createAction(formData: FormData) {
  const product = createSchema.parse(formData)
  return api.post('', { json: product }).json<Product>()
}

export async function updateAction(formData: FormData) {
  const product = updateSchema.parse(formData)
  return api.put(product.id, { json: product }).json<Product>()
}

export async function deleteAction(formData: FormData) {
  const { id } = deleteSchema.parse(formData)
  return api.delete(id).json<{ success: boolean }>()
}
