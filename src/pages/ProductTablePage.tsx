interface Product {
  category: string
  price: string
  stocked: boolean
  name: string
}

function ProductCategoryRow({ category }: { category: string }) {
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

function ProductRow({ product }: { product: Product }) {
  const name = product.stocked ? (
    product.name
  ) : (
    <span className="text-red-500">{product.name}</span>
  )

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-2 text-sm text-gray-900">{name}</td>
      <td className="px-4 py-2 text-sm text-gray-600">{product.price}</td>
    </tr>
  )
}

function ProductTable({ products }: { products: Array<Product> }) {
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

function SearchBar() {
  return (
    <form className="mb-4 flex items-center gap-4">
      <input
        type="text"
        placeholder="Search..."
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
      <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        Only show products in stock
      </label>
    </form>
  )
}

function FilterableProductTable({ products }: { products: Array<Product> }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <SearchBar />
      <ProductTable products={products} />
    </div>
  )
}

const PRODUCTS: Array<Product> = [
  { category: 'Fruits', price: '$1', stocked: true, name: 'Apple' },
  { category: 'Fruits', price: '$1', stocked: true, name: 'Dragonfruit' },
  { category: 'Fruits', price: '$2', stocked: false, name: 'Passionfruit' },
  { category: 'Vegetables', price: '$2', stocked: true, name: 'Spinach' },
  { category: 'Vegetables', price: '$4', stocked: false, name: 'Pumpkin' },
  { category: 'Vegetables', price: '$1', stocked: true, name: 'Peas' },
]

export default function ProductTablePage() {
  return <FilterableProductTable products={PRODUCTS} />
}
