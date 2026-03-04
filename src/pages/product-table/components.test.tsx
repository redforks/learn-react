import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
import { action, loader } from './data'
import { resetProducts, server } from './mocks'

beforeAll(() => server.listen())

afterEach(() => {
  server.resetHandlers()
  resetProducts()
})

afterAll(() => server.close())

describe('ProductCategoryRow', () => {
  it('renders category name as table header with colSpan=3', () => {
    const { container } = render(
      <table>
        <tbody>
          <ProductCategoryRow category="Fruits" />
        </tbody>
      </table>,
    )
    expect(screen.getByText('Fruits')).toBeInTheDocument()
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

  function renderWithRouter(ui: React.ReactElement) {
    const Stub = createRoutesStub([
      {
        path: '/',
        Component: () => ui,
      },
    ])
    return render(<Stub initialEntries={['/']} />)
  }

  it('renders product details and actions', () => {
    renderWithRouter(
      <table>
        <tbody>
          <ProductRow product={mockProduct} onEdit={() => {}} />
        </tbody>
      </table>,
    )

    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('$1')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })

  it('renders out-of-stock product in red text', () => {
    const product = {
      id: '3',
      category: 'Fruits',
      price: '$2',
      stocked: false,
      name: 'Passionfruit',
    }
    const { container } = renderWithRouter(
      <table>
        <tbody>
          <ProductRow product={product} onEdit={() => {}} />
        </tbody>
      </table>,
    )

    const nameSpan = container.querySelector('span')
    expect(nameSpan).toHaveClass('text-red-500')
  })

  it('calls onEdit when Edit button is clicked', () => {
    const onEdit = vi.fn()
    renderWithRouter(
      <table>
        <tbody>
          <ProductRow product={mockProduct} onEdit={onEdit} />
        </tbody>
      </table>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
    expect(onEdit).toHaveBeenCalledWith(mockProduct)
  })
})

describe('ProductTable', () => {
  function renderWithRouter(ui: React.ReactElement) {
    const Stub = createRoutesStub([
      {
        path: '/',
        Component: () => ui,
      },
    ])
    return render(<Stub initialEntries={['/']} />)
  }

  it('renders table with name, price and actions headers', () => {
    renderWithRouter(<ProductTable products={[]} onEdit={() => {}} />)

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
    renderWithRouter(<ProductTable products={products} onEdit={() => {}} />)

    expect(screen.getByText('Fruits')).toBeInTheDocument()
    expect(screen.getByText('Vegetables')).toBeInTheDocument()
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Banana')).toBeInTheDocument()
    expect(screen.getByText('Carrot')).toBeInTheDocument()
  })

  it('renders empty table when no products', () => {
    renderWithRouter(<ProductTable products={[]} onEdit={() => {}} />)

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
    const { container } = renderWithRouter(
      <ProductTable products={products} onEdit={() => {}} />,
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
  function renderWithRouter(form: React.ReactElement) {
    const Stub = createRoutesStub([
      {
        path: '/',
        Component: () => form,
      },
    ])
    return render(<Stub initialEntries={['/']} />)
  }

  it('renders form with empty fields and create action for new product', () => {
    const { container } = renderWithRouter(
      <ProductForm product={null} onCancel={() => {}} />,
    )

    expect(screen.getByText('Add New Product')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument()

    const actionInput = container.querySelector(
      'input[name="_action"]',
    ) as HTMLInputElement
    expect(actionInput).toBeTruthy()
    expect(actionInput.value).toBe('create')
  })

  it('renders form with product data and update action for editing', () => {
    const product = {
      id: '1',
      category: 'Fruits',
      price: '$1',
      stocked: true,
      name: 'Apple',
    }
    const { container } = renderWithRouter(
      <ProductForm product={product} onCancel={() => {}} />,
    )

    expect(screen.getByText('Edit Product')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument()

    const actionInput = container.querySelector(
      'input[name="_action"]',
    ) as HTMLInputElement
    expect(actionInput).toBeTruthy()
    expect(actionInput.value).toBe('update')
  })

  it('calls onCancel when Cancel button is clicked', () => {
    const onCancel = vi.fn()
    renderWithRouter(<ProductForm product={null} onCancel={onCancel} />)

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalled()
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
        action,
      },
    ])
  }

  it('renders all products and Add Product button by default', async () => {
    const Stub = createStub()
    render(<Stub initialEntries={['/']} />)

    expect(await screen.findByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Dragonfruit')).toBeInTheDocument()
    expect(screen.getByText('Passionfruit')).toBeInTheDocument()
    expect(screen.getByText('Spinach')).toBeInTheDocument()
    expect(screen.getByText('Pumpkin')).toBeInTheDocument()
    expect(screen.getByText('Peas')).toBeInTheDocument()

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

  it('shows edit form with product data when Edit button is clicked', async () => {
    const Stub = createStub()
    render(<Stub initialEntries={['/']} />)

    await screen.findByText('Apple')
    fireEvent.click(screen.getAllByRole('button', { name: 'Edit' })[0])

    expect(screen.getByText('Edit Product')).toBeInTheDocument()
    const nameInput = screen.getByLabelText('Name') as HTMLInputElement
    expect(nameInput.value).toBe('Apple')
  })

  it('hides form and clears editing state when Cancel is clicked', async () => {
    const Stub = createStub()
    render(<Stub initialEntries={['/']} />)

    await screen.findByText('Apple')
    fireEvent.click(screen.getByRole('button', { name: 'Add Product' }))
    expect(screen.getByText('Add New Product')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByText('Add New Product')).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Add Product' }),
    ).toBeInTheDocument()
  })

  it('hides edit form and clears editing state when Cancel is clicked', async () => {
    const Stub = createStub()
    render(<Stub initialEntries={['/']} />)

    await screen.findByText('Apple')
    fireEvent.click(screen.getAllByRole('button', { name: 'Edit' })[0])
    expect(screen.getByText('Edit Product')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByText('Edit Product')).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Add Product' }),
    ).toBeInTheDocument()
  })

  it('deletes a product when Delete button is clicked', async () => {
    const Stub = createStub()
    render(<Stub initialEntries={['/']} />)

    // Wait for products to load and verify Apple exists
    expect(await screen.findByText('Apple')).toBeInTheDocument()

    // Click the first Delete button (for Apple)
    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' })
    fireEvent.click(deleteButtons[0])

    // Wait for delete to complete - Apple should be gone
    await screen.findByText('Deleting...')
    expect(screen.queryByText('Apple')).not.toBeInTheDocument()
  })

  it('adds a new product when form is submitted', async () => {
    const Stub = createStub()
    render(<Stub initialEntries={['/']} />)

    // Wait for products to load
    await screen.findByText('Apple')

    // Click Add Product button
    fireEvent.click(screen.getByRole('button', { name: 'Add Product' }))

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Mango' },
    })
    fireEvent.change(screen.getByLabelText('Category'), {
      target: { value: 'Fruits' },
    })
    fireEvent.change(screen.getByLabelText('Price'), {
      target: { value: '$3' },
    })

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Create' }))

    // Wait for form to close
    await waitFor(() => {
      expect(screen.queryByText('Add New Product')).not.toBeInTheDocument()
    })
    // Wait for new product to appear
    expect(await screen.findByText('Mango')).toBeInTheDocument()
  })

  it('updates a product when edit form is submitted', async () => {
    const Stub = createStub()
    render(<Stub initialEntries={['/']} />)

    // Wait for products to load
    await screen.findByText('Apple')

    // Click the first Edit button (for Apple)
    const editButtons = screen.getAllByRole('button', { name: 'Edit' })
    fireEvent.click(editButtons[0])

    // Verify form shows current product data
    expect(screen.getByText('Edit Product')).toBeInTheDocument()
    const nameInput = screen.getByLabelText('Name') as HTMLInputElement
    expect(nameInput.value).toBe('Apple')

    // Update the name
    fireEvent.change(nameInput, { target: { value: 'Green Apple' } })

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Update' }))

    // Wait for form to close
    await waitFor(() => {
      expect(screen.queryByText('Edit Product')).not.toBeInTheDocument()
    })
    // Wait for updated product to appear
    expect(await screen.findByText('Green Apple')).toBeInTheDocument()
    expect(screen.queryByText('Apple')).not.toBeInTheDocument()
  })
})

describe('FilterableProductTable with userEvent', () => {
  function createStub() {
    return createRoutesStub([
      {
        path: '/',
        Component: FilterableProductTable,
        HydrateFallback: () => null,
        loader,
        action,
      },
    ])
  }

  it('adds a new product using userEvent.type and userEvent.click', async () => {
    const user = userEvent.setup()
    const Stub = createStub()
    render(<Stub initialEntries={['/']} />)

    // Wait for products to load
    await screen.findByText('Apple')

    // Click Add Product button
    await user.click(screen.getByRole('button', { name: 'Add Product' }))

    // Fill in the form using userEvent.type for text input
    await user.type(screen.getByLabelText('Name'), 'Mango')
    await user.type(screen.getByLabelText('Category'), 'Fruits')
    await user.type(screen.getByLabelText('Price'), '$3')

    // Toggle checkbox using userEvent.click
    const inStockCheckbox = screen.getByRole('checkbox', { name: 'In Stock' })
    await user.click(inStockCheckbox)
    expect(inStockCheckbox).toBeChecked()

    // Submit the form
    await user.click(screen.getByRole('button', { name: 'Create' }))

    // Wait for form to close and new product to appear
    await waitFor(() => {
      expect(screen.queryByText('Add New Product')).not.toBeInTheDocument()
    })
    expect(await screen.findByText('Mango')).toBeInTheDocument()
  })

  it('updates a product using userEvent for input and click', async () => {
    const user = userEvent.setup()
    const Stub = createStub()
    render(<Stub initialEntries={['/']} />)

    // Wait for products to load
    await screen.findByText('Apple')

    // Click the first Edit button (for Apple)
    const editButtons = screen.getAllByRole('button', { name: 'Edit' })
    await user.click(editButtons[0])

    // Verify form shows current product data
    expect(screen.getByText('Edit Product')).toBeInTheDocument()
    const nameInput = screen.getByLabelText('Name') as HTMLInputElement
    expect(nameInput.value).toBe('Apple')

    // Clear and update the name using userEvent
    await user.clear(nameInput)
    await user.type(nameInput, 'Green Apple')

    // Submit the form
    await user.click(screen.getByRole('button', { name: 'Update' }))

    // Wait for form to close and updated product to appear
    await waitFor(() => {
      expect(screen.queryByText('Edit Product')).not.toBeInTheDocument()
    })
    expect(await screen.findByText('Green Apple')).toBeInTheDocument()
    expect(screen.queryByText('Apple')).not.toBeInTheDocument()
  })

  it('deletes a product using userEvent.click', async () => {
    const user = userEvent.setup()
    const Stub = createStub()
    render(<Stub initialEntries={['/']} />)

    // Wait for products to load
    expect(await screen.findByText('Apple')).toBeInTheDocument()

    // Click the first Delete button (for Apple)
    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' })
    await user.click(deleteButtons[0])

    // Wait for delete to complete - Apple should be gone
    await waitFor(
      () => {
        expect(screen.queryByText('Apple')).not.toBeInTheDocument()
      },
      { timeout: 3000 },
    )
  })

  it('cancels form using userEvent.click', async () => {
    const user = userEvent.setup()
    const Stub = createStub()
    render(<Stub initialEntries={['/']} />)

    // Wait for products to load
    await screen.findByText('Apple')

    // Click Add Product button
    await user.click(screen.getByRole('button', { name: 'Add Product' }))
    expect(screen.getByText('Add New Product')).toBeInTheDocument()

    // Fill some data
    await user.type(screen.getByLabelText('Name'), 'Test Product')

    // Cancel the form
    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    // Form should be closed, Add Product button visible again
    expect(screen.queryByText('Add New Product')).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Add Product' }),
    ).toBeInTheDocument()
    // Product should not be added
    expect(screen.queryByText('Test Product')).not.toBeInTheDocument()
  })
})

describe('SearchBar with userEvent', () => {
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

  it('types in search input using userEvent.type', async () => {
    const user = userEvent.setup()
    renderWithUrl('/')

    const input = screen.getByPlaceholderText('Search...')
    await user.type(input, 'apple')

    expect(screen.getByTestId('search')).toHaveTextContent('search=apple')
  })

  it('clears search input using userEvent.clear', async () => {
    const user = userEvent.setup()
    renderWithUrl('/?search=apple')

    const input = screen.getByPlaceholderText('Search...')
    expect((input as HTMLInputElement).value).toBe('apple')

    await user.clear(input)

    expect(screen.getByTestId('search')).toHaveTextContent('search=')
  })

  it('toggles checkbox using userEvent.click', async () => {
    const user = userEvent.setup()
    renderWithUrl('/')

    const checkbox = screen.getByRole('checkbox', {
      name: /only show products in stock/i,
    })
    expect((checkbox as HTMLInputElement).checked).toBe(false)

    await user.click(checkbox)
    expect(screen.getByTestId('search')).toHaveTextContent('inStockOnly=true')

    await user.click(checkbox)
    expect(screen.getByTestId('search')).toHaveTextContent('search=')
    expect(screen.getByTestId('search')).not.toHaveTextContent('inStockOnly')
  })
})
