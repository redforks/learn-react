import { useId, useState } from 'react'
import {
  Form,
  useLoaderData,
  useRevalidator,
  useSearchParams,
  useSubmit,
} from 'react-router-dom'
import {
  createProduct,
  deleteProduct,
  type Product,
  type ProductInput,
  updateProduct,
} from './data'

export function ProductCategoryRow({ category }: { category: string }) {
  return (
    <tr>
      <th
        colSpan={3}
        className="bg-gray-100 px-4 py-2 text-center text-sm font-semibold text-gray-700"
      >
        {category}
      </th>
    </tr>
  )
}

export function ProductRow({
  product,
  onEdit,
  onDelete,
}: {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
}) {
  const name = (
    <span className={product.stocked ? '' : 'text-red-500'}>
      {product.name}
    </span>
  )

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-2 text-sm text-gray-900">{name}</td>
      <td className="px-4 py-2 text-sm text-gray-600">{product.price}</td>
      <td className="px-4 py-2 text-sm">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(product.id)}
            className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
}: {
  products: Array<Product>
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
}) {
  const rows: Array<React.ReactNode> = []
  let lastCategory: string | null = null

  products.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category}
        />,
      )
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.id}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    )
    lastCategory = product.category
  })

  return (
    <table className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <thead>
        <tr className="border-b border-gray-200 bg-gray-50">
          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
            Name
          </th>
          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
            Price
          </th>
          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

export function SearchBar() {
  const [searchParams] = useSearchParams()
  const submit = useSubmit()
  const search = searchParams.get('search') ?? ''
  const inStockOnly = searchParams.get('inStockOnly') === 'true'

  return (
    <Form method="get" className="mb-4 flex items-center gap-4">
      <input
        type="text"
        name="search"
        value={search}
        placeholder="Search..."
        onChange={(e) => submit(e.target.form)}
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
      <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          name="inStockOnly"
          value="true"
          checked={inStockOnly}
          onChange={(e) => submit(e.target.form)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        Only show products in stock
      </label>
    </Form>
  )
}

const emptyProduct: ProductInput = {
  category: '',
  price: '$',
  stocked: false,
  name: '',
}

export function ProductForm({
  product,
  onSave,
  onCancel,
}: {
  product: Product | null
  onSave: (data: ProductInput) => void
  onCancel: () => void
}) {
  const nameId = useId()
  const categoryId = useId()
  const priceId = useId()
  const [formData, setFormData] = useState<ProductInput>(
    product ?? emptyProduct,
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4"
    >
      <h3 className="mb-3 text-sm font-semibold text-gray-700">
        {product ? 'Edit Product' : 'Add New Product'}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={nameId} className="mb-1 block text-xs text-gray-600">
            Name
          </label>
          <input
            id={nameId}
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200"
          />
        </div>
        <div>
          <label
            htmlFor={categoryId}
            className="mb-1 block text-xs text-gray-600"
          >
            Category
          </label>
          <input
            id={categoryId}
            type="text"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            required
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200"
          />
        </div>
        <div>
          <label htmlFor={priceId} className="mb-1 block text-xs text-gray-600">
            Price
          </label>
          <input
            id={priceId}
            type="text"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            required
            placeholder="$1"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200"
          />
        </div>
        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={formData.stocked}
              onChange={(e) =>
                setFormData({ ...formData, stocked: e.target.checked })
              }
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            In Stock
          </label>
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
        >
          {product ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}

export function FilterableProductTable() {
  const products = useLoaderData<Product[]>()
  const revalidator = useRevalidator()
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleCreate = async (data: ProductInput) => {
    await createProduct(data)
    setShowForm(false)
    revalidator.revalidate()
  }

  const handleUpdate = async (data: ProductInput) => {
    if (editingProduct) {
      await updateProduct({ ...editingProduct, ...data })
      setEditingProduct(null)
      setShowForm(false)
      revalidator.revalidate()
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id)
      revalidator.revalidate()
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleCancel = () => {
    setEditingProduct(null)
    setShowForm(false)
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <SearchBar />
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600"
          >
            Add Product
          </button>
        )}
      </div>
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={editingProduct ? handleUpdate : handleCreate}
          onCancel={handleCancel}
        />
      )}
      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
