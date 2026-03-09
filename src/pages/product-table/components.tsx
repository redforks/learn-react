import { useForm } from '@tanstack/react-form'
import { useRouter } from '@tanstack/react-router'
import { useId, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
    <TableRow className="bg-muted/50">
      <th colSpan={3} className="text-center font-semibold p-3">
        {category}
      </th>
    </TableRow>
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
    <TableRow>
      <TableCell>{name}</TableCell>
      <TableCell>${product.price}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button size="xs" variant="secondary" onClick={() => onEdit(product)}>
            Edit
          </Button>
          <form onSubmit={handleDelete} className="inline">
            <input type="hidden" name="id" value={product.id} />
            <Button
              type="submit"
              size="xs"
              variant="destructive"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </form>
        </div>
      </TableCell>
    </TableRow>
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{rows}</TableBody>
    </Table>
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
    <FieldGroup className="flex flex-row items-center gap-4">
      <Field>
        <Input
          name="search"
          value={search.search}
          placeholder="Search..."
          onChange={(e) => handleChange({ search: e.target.value })}
          className="w-64"
        />
      </Field>
      <Field orientation="horizontal">
        <FieldLabel className="cursor-pointer">
          <Checkbox
            checked={search.inStockOnly}
            onCheckedChange={(checked) =>
              handleChange({ inStockOnly: checked === true })
            }
          />
          Only show products in stock
        </FieldLabel>
      </Field>
    </FieldGroup>
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
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const nameId = useId()
  const categoryId = useId()
  const priceId = useId()

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
      className="mb-4 rounded-lg border bg-muted/30 p-4"
    >
      <h3 className="mb-3 text-sm font-semibold">
        {product ? 'Edit Product' : 'Add New Product'}
      </h3>
      <FieldGroup className="grid grid-cols-2 gap-4">
        <form.Field name="name">
          {(field) => (
            <Field data-invalid={field.state.meta.errors.length > 0}>
              <FieldLabel htmlFor={nameId}>Name</FieldLabel>
              <Input
                id={nameId}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={field.state.meta.errors.length > 0}
              />
              <FieldError
                errors={field.state.meta.errors.map((e) =>
                  typeof e === 'string' ? { message: e } : e,
                )}
              />
            </Field>
          )}
        </form.Field>
        <form.Field name="category">
          {(field) => (
            <Field data-invalid={field.state.meta.errors.length > 0}>
              <FieldLabel htmlFor={categoryId}>Category</FieldLabel>
              <Input
                id={categoryId}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={field.state.meta.errors.length > 0}
              />
              <FieldError
                errors={field.state.meta.errors.map((e) =>
                  typeof e === 'string' ? { message: e } : e,
                )}
              />
            </Field>
          )}
        </form.Field>
        <form.Field name="price">
          {(field) => (
            <Field data-invalid={field.state.meta.errors.length > 0}>
              <FieldLabel htmlFor={priceId}>Price</FieldLabel>
              <Input
                id={priceId}
                placeholder="1.00"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={field.state.meta.errors.length > 0}
              />
              <FieldError
                errors={field.state.meta.errors.map((e) =>
                  typeof e === 'string' ? { message: e } : e,
                )}
              />
            </Field>
          )}
        </form.Field>
        <form.Field name="stocked">
          {(field) => (
            <Field orientation="horizontal" className="items-end">
              <FieldLabel className="cursor-pointer">
                <Checkbox
                  name={field.name}
                  checked={field.state.value}
                  onCheckedChange={(checked) =>
                    field.handleChange(checked === true)
                  }
                />
                In Stock
              </FieldLabel>
            </Field>
          )}
        </form.Field>
      </FieldGroup>
      <div className="mt-4 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : product ? 'Update' : 'Create'}
        </Button>
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Products</CardTitle>
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>Add Product</Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <SearchBar />
        {showForm && (
          <ProductForm
            key={editingProduct ? editingProduct.id : 'new'}
            product={editingProduct}
            onCancel={handleCancel}
            onSuccess={handleCancel}
          />
        )}
        <ProductTable products={products} onEdit={handleEdit} />
      </CardContent>
    </Card>
  )
}
