import { useForm } from '@tanstack/react-form'
import { useRouter } from '@tanstack/react-router'
import { useId, useState } from 'react'
import {
  baseProductSchema,
  createAction,
  deleteAction,
  type Product,
  type ProductInput,
  updateAction,
} from './data'
import { productRoute } from './route'

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
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const name = (
    <span className={product.stocked ? '' : 'text-red-500'}>
      {product.name}
    </span>
  )

  async function handleDelete(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsDeleting(true)
    try {
      await deleteAction(product.id)
      await router.invalidate()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-2 text-sm text-gray-900">{name}</td>
      <td className="px-4 py-2 text-sm text-gray-600">${product.price}</td>
      <td className="px-4 py-2 text-sm">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
          >
            Edit
          </button>
          <form onSubmit={handleDelete} className="inline">
            <input type="hidden" name="id" value={product.id} />
            <button
              type="submit"
              disabled={isDeleting}
              className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600 disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </form>
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
  const search = productRoute.useSearch()
  const navigate = productRoute.useNavigate()

  function handleChange(updates: Record<string, unknown>) {
    navigate({
      search: (prev) => ({ ...prev, ...updates }),
    })
  }

  return (
    <form
      className="mb-4 flex items-center gap-4"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="text"
        name="search"
        value={search.search}
        placeholder="Search..."
        onChange={(e) => handleChange({ search: e.target.value })}
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
      <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          name="inStockOnly"
          checked={search.inStockOnly}
          onChange={(e) => handleChange({ inStockOnly: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        Only show products in stock
      </label>
    </form>
  )
}

const emptyProduct: ProductInput = {
  category: '',
  price: '',
  stocked: false,
  name: '',
}

export function ProductForm({
  product,
  onCancel,
  onSuccess,
}: {
  product: Product | null
  onCancel: () => void
  onSuccess?: () => void
}) {
  const nameId = useId()
  const categoryId = useId()
  const priceId = useId()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    defaultValues: product ?? emptyProduct,
    validators: {
      onChange: baseProductSchema,
    },
    onSubmit: async ({ value }: { value: ProductInput }) => {
      setIsSubmitting(true)
      try {
        if (product) {
          await updateAction({ ...value, id: product.id })
        } else {
          await createAction(value)
        }
        await router.invalidate()
        onSuccess?.()
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4"
    >
      <h3 className="mb-3 text-sm font-semibold text-gray-700">
        {product ? 'Edit Product' : 'Add New Product'}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <form.Field name="name">
          {(field) => (
            <div>
              <label
                htmlFor={nameId}
                className="mb-1 block text-xs text-gray-600"
              >
                Name
              </label>
              <input
                id={nameId}
                type="text"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="mt-1 text-xs text-red-500">
                  {field.state.meta.errors
                    .map((e) =>
                      typeof e === 'string'
                        ? e
                        : (e as { message: string }).message,
                    )
                    .join(', ')}
                </p>
              )}
            </div>
          )}
        </form.Field>
        <form.Field name="category">
          {(field) => (
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
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="mt-1 text-xs text-red-500">
                  {field.state.meta.errors
                    .map((e) =>
                      typeof e === 'string'
                        ? e
                        : (e as { message: string }).message,
                    )
                    .join(', ')}
                </p>
              )}
            </div>
          )}
        </form.Field>
        <form.Field name="price">
          {(field) => (
            <div>
              <label
                htmlFor={priceId}
                className="mb-1 block text-xs text-gray-600"
              >
                Price
              </label>
              <input
                id={priceId}
                type="text"
                placeholder="1.00"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="mt-1 text-xs text-red-500">
                  {field.state.meta.errors
                    .map((e) =>
                      typeof e === 'string'
                        ? e
                        : (e as { message: string }).message,
                    )
                    .join(', ')}
                </p>
              )}
            </div>
          )}
        </form.Field>
        <form.Field name="stocked">
          {(field) => (
            <div className="flex items-end">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name={field.name}
                  checked={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                In Stock
              </label>
            </div>
          )}
        </form.Field>
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
    </form>
  )
}

export function FilterableProductTable() {
  const products = productRoute.useLoaderData() as Product[]
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
        <ProductForm
          key={editingProduct ? editingProduct.id : 'new'}
          product={editingProduct}
          onCancel={handleCancel}
          onSuccess={handleCancel}
        />
      )}
      <ProductTable products={products} onEdit={handleEdit} />
    </div>
  )
}
