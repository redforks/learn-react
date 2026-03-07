import ky from 'ky'
import { z } from 'zod'

const checkboxTransform = z
  .string()
  .optional()
  .transform((v) => v === 'on')

export const baseProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  price: z.string().regex(/^\d+(\.\d+)?$/, 'Price must be a valid decimal'),
  stocked: z.boolean(),
})

export const createSchema = z.object({
  name: baseProductSchema.shape.name,
  category: baseProductSchema.shape.category,
  price: baseProductSchema.shape.price,
  stocked: checkboxTransform,
})

export const updateSchema = z.object({
  id: z.string(),
  name: baseProductSchema.shape.name,
  category: baseProductSchema.shape.category,
  price: baseProductSchema.shape.price,
  stocked: checkboxTransform,
})

export const deleteSchema = z.object({
  id: z.string(),
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

export async function loader(searchParams: string): Promise<Product[]> {
  const products = await api.get('', { searchParams }).json<Product[]>()
  return products.sort(
    (a, b) => a.category.localeCompare(b.category) || a.id.localeCompare(b.id),
  )
}

export async function createAction(formData: FormData) {
  const product = createSchema.parse(Object.fromEntries(formData))
  return api.post('', { json: product }).json<Product>()
}

export async function updateAction(formData: FormData) {
  const product = updateSchema.parse(Object.fromEntries(formData))
  return api.put(product.id, { json: product }).json<Product>()
}

export async function deleteAction(formData: FormData) {
  const { id } = deleteSchema.parse(Object.fromEntries(formData))
  return api.delete(id).json<{ success: boolean }>()
}
