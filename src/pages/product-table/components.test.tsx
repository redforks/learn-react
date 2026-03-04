import { fireEvent, render, screen } from '@testing-library/react'
import { createRoutesStub, useLocation } from 'react-router-dom'
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import {
  FilterableProductTable,
  ProductCategoryRow,
  ProductForm,
  ProductRow,
  ProductTable,
  SearchBar,
} from './components'
import { loader } from './data'
import { resetProducts, server } from './mocks'

beforeAll(() => server.listen())

afterEach(() => {
  server.resetHandlers()
  resetProducts()
})

afterAll(() => server.close())

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

  it('renders as table header with colSpan=3', () => {
    const { container } = render(
      <table>
        <tbody>
          <ProductCategoryRow category="Test" />
        </tbody>
      </table>,
    )
    const th = container.querySelector('th')
    expect(th).toHaveAttribute('colSpan', '3')
  })
})

describe('ProductRow', () => {
  const mockProduct = {
    id: '1',
    category: 'Fruits',
    price: '$1',
    stocked: true,
    name: 'Apple',
  }

  it('renders product name and price', () => {
    render(
      <table>
        <tbody>
          <ProductRow
            product={mockProduct}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </tbody>
      </table>,
    )

    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('$1')).toBeInTheDocument()
  })

  it('renders stocked product in normal text', () => {
    const { container } = render(
      <table>
        <tbody>
          <ProductRow
            product={mockProduct}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </tbody>
      </table>,
    )

    const nameSpan = container.querySelector('span')
    expect(nameSpan).not.toHaveClass('text-red-500')
  })

  it('renders out-of-stock product in red text', () => {
    const product = {
      id: '3',
      category: 'Fruits',
      price: '$2',
      stocked: false,
      name: 'Passionfruit',
    }
    const { container } = render(
      <table>
        <tbody>
          <ProductRow product={product} onEdit={() => {}} onDelete={() => {}} />
        </tbody>
      </table>,
    )

    const nameSpan = container.querySelector('span')
    expect(nameSpan).toHaveClass('text-red-500')
  })

  it('renders Edit and Delete buttons', () => {
    render(
      <table>
        <tbody>
          <ProductRow
            product={mockProduct}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </tbody>
      </table>,
    )

    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })

  it('calls onEdit when Edit button is clicked', () => {
    const onEdit = vi.fn()
    render(
      <table>
        <tbody>
          <ProductRow
            product={mockProduct}
            onEdit={onEdit}
            onDelete={() => {}}
          />
        </tbody>
      </table>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
    expect(onEdit).toHaveBeenCalledWith(mockProduct)
  })

  it('calls onDelete when Delete button is clicked', () => {
    const onDelete = vi.fn()
    render(
      <table>
        <tbody>
          <ProductRow
            product={mockProduct}
            onEdit={() => {}}
            onDelete={onDelete}
          />
        </tbody>
      </table>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onDelete).toHaveBeenCalledWith('1')
  })
})

describe('ProductTable', () => {
  it('renders table with name, price and actions headers', () => {
    render(<ProductTable products={[]} onEdit={() => {}} onDelete={() => {}} />)

    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Price')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
  })

  it('renders products grouped by category', () => {
    const products = [
      {
        id: '1',
        category: 'Fruits',
        price: '$1',
        stocked: true,
        name: 'Apple',
      },
      {
        id: '2',
        category: 'Fruits',
        price: '$2',
        stocked: false,
        name: 'Banana',
      },
      {
        id: '3',
        category: 'Vegetables',
        price: '$1',
        stocked: true,
        name: 'Carrot',
      },
    ]
    render(
      <ProductTable
        products={products}
        onEdit={() => {}}
        onDelete={() => {}}
      />,
    )

    expect(screen.getByText('Fruits')).toBeInTheDocument()
    expect(screen.getByText('Vegetables')).toBeInTheDocument()
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Banana')).toBeInTheDocument()
    expect(screen.getByText('Carrot')).toBeInTheDocument()
  })

  it('renders empty table when no products', () => {
    render(<ProductTable products={[]} onEdit={() => {}} onDelete={() => {}} />)

    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Price')).toBeInTheDocument()
    expect(screen.queryByText('Apple')).not.toBeInTheDocument()
  })

  it('renders only category header once per category', () => {
    const products = [
      {
        id: '1',
        category: 'Fruits',
        price: '$1',
        stocked: true,
        name: 'Apple',
      },
      {
        id: '2',
        category: 'Fruits',
        price: '$2',
        stocked: true,
        name: 'Orange',
      },
    ]
    const { container } = render(
      <ProductTable
        products={products}
        onEdit={() => {}}
        onDelete={() => {}}
      />,
    )

    const categoryHeaders = container.querySelectorAll('th[colSpan="3"]')
    expect(categoryHeaders).toHaveLength(1)
  })
})

describe('SearchBar', () => {
  function renderWithUrl(initialUrl: string) {
    function SearchSpy() {
      const { search } = useLocation()
      return <div data-testid="search">{search}</div>
    }

    function WithSpy() {
      return (
        <>
          <SearchBar />
          <SearchSpy />
        </>
      )
    }

    const Stub = createRoutesStub([
      {
        path: '/',
        Component: WithSpy,
      },
    ])
    render(<Stub initialEntries={[initialUrl]} />)
  }

  it('renders search input and checkbox', () => {
    renderWithUrl('/')

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
    expect(
      screen.getByRole('checkbox', { name: /only show products in stock/i }),
    ).toBeInTheDocument()
  })

  it('displays search value from URL params', () => {
    renderWithUrl('/?search=dragon')

    const input = screen.getByPlaceholderText('Search...') as HTMLInputElement
    expect(input.value).toBe('dragon')
  })

  it('displays checked checkbox when inStockOnly is in URL', () => {
    renderWithUrl('/?inStockOnly=true')

    const checkbox = screen.getByRole('checkbox', {
      name: /only show products in stock/i,
    }) as HTMLInputElement
    expect(checkbox.checked).toBe(true)
  })

  it('displays unchecked checkbox when inStockOnly is not in URL', () => {
    renderWithUrl('/')

    const checkbox = screen.getByRole('checkbox', {
      name: /only show products in stock/i,
    }) as HTMLInputElement
    expect(checkbox.checked).toBe(false)
  })

  it('updates URL search param when typing in search input', () => {
    renderWithUrl('/')

    const input = screen.getByPlaceholderText('Search...')
    fireEvent.change(input, { target: { value: 'apple' } })

    expect(screen.getByTestId('search')).toHaveTextContent('?search=apple')
  })

  it('removes search param from URL when input is cleared', () => {
    renderWithUrl('/?search=apple')

    const input = screen.getByPlaceholderText('Search...')
    fireEvent.change(input, { target: { value: '' } })

    expect(screen.getByTestId('search')).toHaveTextContent('?search=')
  })

  it('adds inStockOnly param to URL when checkbox is checked', () => {
    renderWithUrl('/')

    const checkbox = screen.getByRole('checkbox', {
      name: /only show products in stock/i,
    })
    fireEvent.click(checkbox)

    expect(screen.getByTestId('search')).toHaveTextContent(
      '?search=&inStockOnly=true',
    )
  })

  it('removes inStockOnly param from URL when checkbox is unchecked', () => {
    renderWithUrl('/?inStockOnly=true')

    const checkbox = screen.getByRole('checkbox', {
      name: /only show products in stock/i,
    })
    fireEvent.click(checkbox)

    expect(screen.getByTestId('search')).toHaveTextContent('?search=')
  })
})

describe('ProductForm', () => {
  it('renders form with empty fields for new product', () => {
    render(<ProductForm product={null} onSave={() => {}} onCancel={() => {}} />)

    expect(screen.getByText('Add New Product')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument()
  })

  it('renders form with product data for editing', () => {
    const product = {
      id: '1',
      category: 'Fruits',
      price: '$1',
      stocked: true,
      name: 'Apple',
    }
    render(
      <ProductForm product={product} onSave={() => {}} onCancel={() => {}} />,
    )

    expect(screen.getByText('Edit Product')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument()
  })

  it('calls onCancel when Cancel button is clicked', () => {
    const onCancel = vi.fn()
    render(<ProductForm product={null} onSave={() => {}} onCancel={onCancel} />)

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalled()
  })

  it('calls onSave with form data when submitted', () => {
    const onSave = vi.fn()
    const { container } = render(
      <ProductForm product={null} onSave={onSave} onCancel={() => {}} />,
    )

    const inputs = container.querySelectorAll('input[type="text"]')
    const nameInput = inputs[0]
    const categoryInput = inputs[1]
    const priceInput = inputs[2]

    fireEvent.change(nameInput, { target: { value: 'Mango' } })
    fireEvent.change(categoryInput, { target: { value: 'Fruits' } })
    fireEvent.change(priceInput, { target: { value: '$3' } })

    fireEvent.click(screen.getByRole('button', { name: 'Create' }))

    expect(onSave).toHaveBeenCalledWith({
      name: 'Mango',
      category: 'Fruits',
      price: '$3',
      stocked: false,
    })
  })
})

describe('FilterableProductTable', () => {
  function createStub() {
    return createRoutesStub([
      {
        path: '/',
        Component: FilterableProductTable,
        HydrateFallback: () => null,
        loader,
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

  it('renders Add Product button', async () => {
    const Stub = createStub()
    render(<Stub initialEntries={['/']} />)

    expect(await screen.findByText('Apple')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Add Product' }),
    ).toBeInTheDocument()
  })

  it('shows form when Add Product button is clicked', async () => {
    const Stub = createStub()
    render(<Stub initialEntries={['/']} />)

    await screen.findByText('Apple')
    fireEvent.click(screen.getByRole('button', { name: 'Add Product' }))

    expect(screen.getByText('Add New Product')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Add Product' }),
    ).not.toBeInTheDocument()
  })
})
