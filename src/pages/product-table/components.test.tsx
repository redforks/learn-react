import { render, screen } from '@testing-library/react'
import { createRoutesStub } from 'react-router-dom'
import {
  FilterableProductTable,
  type Product,
  ProductCategoryRow,
  ProductRow,
  ProductTable,
  SearchBar,
} from './components'

const PRODUCTS: Array<Product> = [
  { category: 'Fruits', price: '$1', stocked: true, name: 'Apple' },
  { category: 'Fruits', price: '$1', stocked: true, name: 'Dragonfruit' },
  { category: 'Fruits', price: '$2', stocked: false, name: 'Passionfruit' },
  { category: 'Vegetables', price: '$2', stocked: true, name: 'Spinach' },
  { category: 'Vegetables', price: '$4', stocked: false, name: 'Pumpkin' },
  { category: 'Vegetables', price: '$1', stocked: true, name: 'Peas' },
]

describe('ProductCategoryRow', () => {
  it('renders category name', () => {
    render(
      <table>
        <tbody>
          <ProductCategoryRow category="Fruits" />
        </tbody>
      </table>,
    )
    expect(screen.getByText('Fruits')).toBeInTheDocument()
  })

  it('renders as table header with colSpan=2', () => {
    const { container } = render(
      <table>
        <tbody>
          <ProductCategoryRow category="Test" />
        </tbody>
      </table>,
    )
    const th = container.querySelector('th')
    expect(th).toHaveAttribute('colSpan', '2')
  })
})

describe('ProductRow', () => {
  it('renders product name and price', () => {
    const product = {
      category: 'Fruits',
      price: '$1',
      stocked: true,
      name: 'Apple',
    }
    render(<ProductRow product={product} />)

    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('$1')).toBeInTheDocument()
  })

  it('renders stocked product in normal text', () => {
    const product = {
      category: 'Fruits',
      price: '$1',
      stocked: true,
      name: 'Apple',
    }
    const { container } = render(<ProductRow product={product} />)

    const nameSpan = container.querySelector('span')
    expect(nameSpan).not.toHaveClass('text-red-500')
  })

  it('renders out-of-stock product in red text', () => {
    const product = {
      category: 'Fruits',
      price: '$2',
      stocked: false,
      name: 'Passionfruit',
    }
    const { container } = render(<ProductRow product={product} />)

    const nameSpan = container.querySelector('span')
    expect(nameSpan).toHaveClass('text-red-500')
  })
})

describe('ProductTable', () => {
  it('renders table with name and price headers', () => {
    render(<ProductTable products={[]} />)

    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Price')).toBeInTheDocument()
  })

  it('renders products grouped by category', () => {
    const products = [
      { category: 'Fruits', price: '$1', stocked: true, name: 'Apple' },
      { category: 'Fruits', price: '$2', stocked: false, name: 'Banana' },
      { category: 'Vegetables', price: '$1', stocked: true, name: 'Carrot' },
    ]
    render(<ProductTable products={products} />)

    expect(screen.getByText('Fruits')).toBeInTheDocument()
    expect(screen.getByText('Vegetables')).toBeInTheDocument()
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Banana')).toBeInTheDocument()
    expect(screen.getByText('Carrot')).toBeInTheDocument()
  })

  it('renders empty table when no products', () => {
    render(<ProductTable products={[]} />)

    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Price')).toBeInTheDocument()
    expect(screen.queryByText('Apple')).not.toBeInTheDocument()
  })

  it('renders only category header once per category', () => {
    const products = [
      { category: 'Fruits', price: '$1', stocked: true, name: 'Apple' },
      { category: 'Fruits', price: '$2', stocked: true, name: 'Orange' },
    ]
    const { container } = render(<ProductTable products={products} />)

    const categoryHeaders = container.querySelectorAll('th[colSpan="2"]')
    expect(categoryHeaders).toHaveLength(1)
  })
})

describe('SearchBar', () => {
  it('renders search input and checkbox', () => {
    const Stub = createRoutesStub([
      {
        path: '/',
        Component: SearchBar,
      },
    ])
    render(<Stub initialEntries={['/']} />)

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
    expect(
      screen.getByRole('checkbox', { name: /only show products in stock/i }),
    ).toBeInTheDocument()
  })

  it('displays search value from URL params', () => {
    const Stub = createRoutesStub([
      {
        path: '/',
        Component: SearchBar,
      },
    ])
    render(<Stub initialEntries={['/?search=dragon']} />)

    const input = screen.getByPlaceholderText('Search...') as HTMLInputElement
    expect(input.value).toBe('dragon')
  })

  it('displays checked checkbox when inStockOnly is in URL', () => {
    const Stub = createRoutesStub([
      {
        path: '/',
        Component: SearchBar,
      },
    ])
    render(<Stub initialEntries={['/?inStockOnly=true']} />)

    const checkbox = screen.getByRole('checkbox', {
      name: /only show products in stock/i,
    }) as HTMLInputElement
    expect(checkbox.checked).toBe(true)
  })

  it('displays unchecked checkbox when inStockOnly is not in URL', () => {
    const Stub = createRoutesStub([
      {
        path: '/',
        Component: SearchBar,
      },
    ])
    render(<Stub initialEntries={['/']} />)

    const checkbox = screen.getByRole('checkbox', {
      name: /only show products in stock/i,
    }) as HTMLInputElement
    expect(checkbox.checked).toBe(false)
  })
})

describe('FilterableProductTable', () => {
  function createStub() {
    return createRoutesStub([
      {
        path: '/',
        Component: FilterableProductTable,
        loader: ({ request }: { request: Request }) => {
          const url = new URL(request.url)
          const search = url.searchParams.get('search') ?? ''
          const inStockOnly = url.searchParams.get('inStockOnly') === 'true'

          return PRODUCTS.filter((p) => {
            if (inStockOnly && !p.stocked) {
              return false
            }

            if (
              search &&
              p.name.toLowerCase().indexOf(search.toLowerCase()) === -1
            ) {
              return false
            }
            return true
          })
        },
      },
    ])
  }

  it('renders all products by default', async () => {
    const Stub = createStub()
    render(<Stub initialEntries={['/']} />)

    expect(await screen.findByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Dragonfruit')).toBeInTheDocument()
    expect(screen.getByText('Passionfruit')).toBeInTheDocument()
    expect(screen.getByText('Spinach')).toBeInTheDocument()
    expect(screen.getByText('Pumpkin')).toBeInTheDocument()
    expect(screen.getByText('Peas')).toBeInTheDocument()
  })

  it('filters products by search text (case insensitive)', async () => {
    const Stub = createStub()
    render(<Stub initialEntries={['/?search=apple']} />)

    expect(await screen.findByText('Apple')).toBeInTheDocument()
    expect(screen.queryByText('Dragonfruit')).not.toBeInTheDocument()
    expect(screen.queryByText('Spinach')).not.toBeInTheDocument()
  })

  it('filters products by search text with uppercase input', async () => {
    const Stub = createStub()
    render(<Stub initialEntries={['/?search=DRAGON']} />)

    expect(await screen.findByText('Dragonfruit')).toBeInTheDocument()
    expect(screen.queryByText('Apple')).not.toBeInTheDocument()
  })

  it('filters products by search text with partial match', async () => {
    const Stub = createStub()
    render(<Stub initialEntries={['/?search=fruit']} />)

    expect(await screen.findByText('Dragonfruit')).toBeInTheDocument()
    expect(screen.getByText('Passionfruit')).toBeInTheDocument()
    expect(screen.queryByText('Apple')).not.toBeInTheDocument()
    expect(screen.queryByText('Spinach')).not.toBeInTheDocument()
  })

  it('filters to show only in-stock products when inStockOnly is true', async () => {
    const Stub = createStub()
    render(<Stub initialEntries={['/?inStockOnly=true']} />)

    expect(await screen.findByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Dragonfruit')).toBeInTheDocument()
    expect(screen.queryByText('Passionfruit')).not.toBeInTheDocument()
    expect(screen.getByText('Spinach')).toBeInTheDocument()
    expect(screen.queryByText('Pumpkin')).not.toBeInTheDocument()
    expect(screen.getByText('Peas')).toBeInTheDocument()
  })

  it('combines search and in-stock filters', async () => {
    const Stub = createStub()
    render(<Stub initialEntries={['/?search=fruit&inStockOnly=true']} />)

    expect(await screen.findByText('Dragonfruit')).toBeInTheDocument()
    expect(screen.queryByText('Passionfruit')).not.toBeInTheDocument()
  })

  it('shows no results when filter matches nothing', async () => {
    const Stub = createStub()
    render(<Stub initialEntries={['/?search=nonexistent']} />)

    // Wait for the component to render
    await screen.findByPlaceholderText('Search...')

    expect(screen.queryByText('Apple')).not.toBeInTheDocument()
    expect(screen.queryByText('Spinach')).not.toBeInTheDocument()
  })

  it('shows search bar with correct initial value from URL', async () => {
    const Stub = createStub()
    render(<Stub initialEntries={['/?search=apple']} />)

    const input = (await screen.findByPlaceholderText(
      'Search...',
    )) as HTMLInputElement
    expect(input.value).toBe('apple')
  })

  it('shows checked checkbox when inStockOnly is in URL', async () => {
    const Stub = createStub()
    render(<Stub initialEntries={['/?inStockOnly=true']} />)

    const checkbox = (await screen.findByRole('checkbox', {
      name: /only show products in stock/i,
    })) as HTMLInputElement
    expect(checkbox.checked).toBe(true)
  })

  it('renders category headers even when filter reduces products in category', async () => {
    const Stub = createStub()
    render(<Stub initialEntries={['/?inStockOnly=true']} />)

    // Vegetables category should still show (has Spinach and Peas in stock)
    expect(await screen.findByText('Vegetables')).toBeInTheDocument()
    expect(screen.getByText('Spinach')).toBeInTheDocument()
    expect(screen.getByText('Peas')).toBeInTheDocument()
  })
})

describe('FilterableProductTable with empty products', () => {
  beforeEach(() => {
    const Stub = createRoutesStub([
      {
        path: '/',
        Component: FilterableProductTable,
        loader: () => [],
      },
    ])
    render(<Stub initialEntries={['/']} />)
  })

  it('renders search and table headers', async () => {
    expect(await screen.findByPlaceholderText('Search...')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Price')).toBeInTheDocument()
  })
})
