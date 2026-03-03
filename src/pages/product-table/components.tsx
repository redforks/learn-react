import {
  Form,
  useLoaderData,
  useSearchParams,
  useSubmit,
} from 'react-router-dom'
import type { Product } from './types'

export function ProductCategoryRow({ category }: { category: string }) {
  return (
    <tr>
      <th
        colSpan={2}
        className="bg-gray-100 px-4 py-2 text-center text-sm font-semibold text-gray-700"
      >
        {category}
      </th>
    </tr>
  )
}

export function ProductRow({ product }: { product: Product }) {
  const name = (
    <span className={product.stocked ? '' : 'text-red-500'}>
      {product.name}
    </span>
  )

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-2 text-sm text-gray-900">{name}</td>
      <td className="px-4 py-2 text-sm text-gray-600">{product.price}</td>
    </tr>
  )
}

export function ProductTable({ products }: { products: Array<Product> }) {
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
    rows.push(<ProductRow product={product} key={product.name} />)
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

export function FilterableProductTable() {
  const products = useLoaderData<Product[]>()

  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <SearchBar />
      <ProductTable products={products} />
    </div>
  )
}
