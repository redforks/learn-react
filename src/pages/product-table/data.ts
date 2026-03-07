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

export const searchSchema = z.object({
  search: z.coerce.string().default(''),
  inStockOnly: z.coerce.boolean().default(false),
})

type SearchParams = z.infer<typeof searchSchema>

export async function loader({
  search,
  inStockOnly,
}: SearchParams): Promise<Product[]> {
  const searchParams = `search=${search}&inStockOnly=${inStockOnly}`
  const products = await api.get('', { searchParams }).json<Product[]>()
  return products.sort(
    (a, b) => a.category.localeCompare(b.category) || a.id.localeCompare(b.id),
  )
}

export async function createAction(product: ProductInput) {
  return api.post('', { json: product }).json<Product>()
}

export async function updateAction(product: Product) {
  return api.put(product.id, { json: product }).json<Product>()
}

export async function deleteAction(id: string) {
  return api.delete(id).json<{ success: boolean }>()
}
