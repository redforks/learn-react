import { fireEvent, render, screen } from '@testing-library/react'
import { createRoutesStub, useLocation } from 'react-router-dom'
import {
  FilterableProductTable,
  ProductCategoryRow,
  ProductRow,
  ProductTable,
  SearchBar,
} from './components'
import { loader } from './data'

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

describe('FilterableProductTable', () => {
  function createStub() {
    return createRoutesStub([
      {
        path: '/',
        Component: FilterableProductTable,
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
})
