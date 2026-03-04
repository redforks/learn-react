import { useId, useState } from 'react'
import {
  Form,
  useFetcher,
  useLoaderData,
  useSearchParams,
  useSubmit,
} from 'react-router-dom'
import type { Product, ProductInput } from './data'

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
}: {
  product: Product
  onEdit: (product: Product) => void
}) {
  const fetcher = useFetcher()
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
          <fetcher.Form method="post" className="inline">
            <input type="hidden" name="_action" value="delete" />
            <input type="hidden" name="id" value={product.id} />
            <button
              type="submit"
              disabled={fetcher.state !== 'idle'}
              className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600 disabled:opacity-50"
            >
              {fetcher.state !== 'idle' ? 'Deleting...' : 'Delete'}
            </button>
          </fetcher.Form>
        </div>
      </td>
    </tr>
  )
}

export function ProductTable({
  products,
  onEdit,
}: {
  products: Array<Product>
  onEdit: (product: Product) => void
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
    rows.push(<ProductRow product={product} key={product.id} onEdit={onEdit} />)
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
  onCancel,
}: {
  product: Product | null
  onCancel: () => void
}) {
  const nameId = useId()
  const categoryId = useId()
  const priceId = useId()
  const fetcher = useFetcher()
  const [formData, setFormData] = useState<ProductInput>(
    product ?? emptyProduct,
  )
  const isSubmitting = fetcher.state !== 'idle'

  return (
    <fetcher.Form
      method="post"
      className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4"
    >
      <h3 className="mb-3 text-sm font-semibold text-gray-700">
        {product ? 'Edit Product' : 'Add New Product'}
      </h3>
      <input
        type="hidden"
        name="_action"
        value={product ? 'update' : 'create'}
      />
      {product && <input type="hidden" name="id" value={product.id} />}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={nameId} className="mb-1 block text-xs text-gray-600">
            Name
          </label>
          <input
            id={nameId}
            name="name"
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
            name="category"
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
            name="price"
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
              name="stocked"
              value="true"
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
          disabled={isSubmitting}
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : product ? 'Update' : 'Create'}
        </button>
      </div>
    </fetcher.Form>
  )
}

export function FilterableProductTable() {
  const products = useLoaderData<Product[]>()
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)

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
        <ProductForm product={editingProduct} onCancel={handleCancel} />
      )}
      <ProductTable products={products} onEdit={handleEdit} />
    </div>
  )
}
